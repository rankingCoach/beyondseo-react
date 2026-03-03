const { replaceAll } = require("../helpers/sdk-utils");

const propNameIncludes = (propName, toTest) => {
  return propName.indexOf(toTest) > -1;
};

String.replacei = String.prototype.replacei = function (rep, rby) {
  var pos = this.toLowerCase().indexOf(rep.toLowerCase());
  return pos == -1 ? this : this.substr(0, pos) + rby + this.substr(pos + rep.length);
};

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr) {
    // If a regex pattern
    if (Object.prototype.toString.call(str).toLowerCase() === "[object regexp]") {
      return this.replace(str, newStr);
    }

    // If a string
    return this.replace(new RegExp(str, "g"), newStr);
  };
}

const stripQuote = (value) => {
  if (!value) {
    return value;
  }
  value = replaceAll(value, '"faker', "faker");
  value = replaceAll(value, '"{}"', "{}");
  value = value.replace(/\)"/g, ")");
  return value;
}; //The recursive fn
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

/**
 * This class generates mock for one instance of a class
 * */
class MockDataGenerator {
  generatedLog = [];
  collector = null;
  schemaName = "";
  schemaType = "";
  mockedValue = {};
  depth = 0;

  constructor(schemaName, schemaType, collector, depth) {
    this.schemaName = schemaName;
    this.schemaType = schemaType;
    this.collector = collector;
    this.depth = depth ?? 0;
  }

  generatePropType(what, isArray) {
    if (!what) {
      return undefined;
    }
    if (isArray) {
      return [what, what, what];
    }
    return what;
  }

  generateProp(prop, schemaData) {
    if (prop.type === "null") {
      this.mockedValue[prop.name] = this.generatePropType(null, prop.isArray);
      return this.mockedValue[prop.name];
    }

    if (prop.type === "number") {
      if (propNameIncludes(prop.name, "max")) {
        this.mockedValue[prop.name] = this.generatePropType(`faker.datatype.number({min:10000})`, prop.isArray);
        return this.mockedValue[prop.name];
      }
      if (propNameIncludes(prop.name, "min")) {
        this.mockedValue[prop.name] = this.generatePropType(`faker.datatype.number({max:10000})`, prop.isArray);
        return this.mockedValue[prop.name];
      }
      this.mockedValue[prop.name] = this.generatePropType("faker.datatype.number()", prop.isArray);
      return this.mockedValue[prop.name];
    }

    if (prop.type === "object") {
      this.mockedValue[prop.name] = this.generatePropType("{}", prop.isArray);
      return this.mockedValue[prop.name];
    }

    if (prop.type === "boolean") {
      this.mockedValue[prop.name] = this.generatePropType("faker.datatype.boolean()", prop.isArray);
      return this.mockedValue[prop.name];
    }

    if (prop.type === "string") {
      switch (prop.name) {
        case "status":
          this.mockedValue[prop.name] = this.generatePropType("200", prop.isArray);
          break;
        default:
          this.mockedValue[prop.name] = this.generatePropType("faker.random.words()", prop.isArray);
      }

      return this.mockedValue[prop.name];
    }
    // this is enum type
    const isEnum = prop.type?.includes("keyof typeof");
    if (isEnum) {
      const typeTmp = prop.type;
      const split = typeTmp.split("[");
      const firstPart = split[0].split(" ");
      const realName = firstPart[1].trim();
      const enums = JSON.parse(JSON.stringify(schemaData.item.enums));
      const enumData = enums.find((x) => (x.name = realName));
      enumData.value[0] = replaceAll(enumData.value[0], "\\\\", "\\");

      this.mockedValue[prop.name] = enumData.value[0]; // TODO Randomize enum ?
      if (!this.mockedValue[prop.name]) {
        console.warn("enum not handled correctly::", schemaData.item.enums);
      }
      return this.mockedValue[prop.name];
    }

    // If we reached this spot it means we have a complex pbject and need to mock it again
    const generator = new MockDataGenerator(prop.name, prop.type, this.collector, this.depth + 1);
    this.mockedValue[prop.name] = this.generatePropType(generator.mockElement(), prop.isArray);

    return this.mockedValue[prop.name];
  }

  mockElement() {
    if (this.depth >= 5) {
      return undefined;
    }
    const cpy = { ...this };
    delete cpy.collector;

    if (this.schemaType?.includes("|")) {
      const split = this.schemaType.split("|");
      this.schemaType = split[0].trim(); // TODO randomize schema type?
      cpy.schemaType = split[0].trim(); // TODO randomize schema type?
    }

    const schemaData = this.collector.getByName(this.schemaType);
    const schemaProps = schemaData?.item?.props;
    // if (this.schemaName === "googleLocation" && this.schemaType === "GoogleLocation") {
    //   console.log("schemaName", this.schemaName, this.schemaType, schemaData.item);
    // }
    const isEnum = this.schemaType?.includes("keyof typeof");

    const primitives = ["string", "boolean", "number"];

    if (!schemaProps) {
      if (
        !primitives.includes(this.schemaType) &&
        this.schemaType !== "object" &&
        this.schemaType !== "null" &&
        !isEnum
      ) {
        // TODO
        // console.log("did not find schema props name:: ", this.schemaName);
        // console.log("did not find schema props type:: ", this.schemaType);
      }
    }
    if (primitives.includes(this.schemaType)) {
      let prop = {
        name: this.schemaName,
        type: this.schemaType,
        isArray: false,
      };
      this.mockedValue = this.generateProp(prop, this);
    }

    // Go through each prop and generate a value
    if (Array.isArray(schemaProps)) {
      for (let prop of schemaProps) {
        this.generateProp(prop, schemaData);
      }
      if (schemaProps.length === 0) {
        this.mockedValue[this.schemaName] = {};
        return this.mockedValue;
      }
    } else {
      // this.generateProp(prop, schemaData);
    }

    return this.mockedValue;
  }
}

const generateMockData = (schemaName, collector) => {
  if (!schemaName || !collector) {
    return "";
  }
  const generator = new MockDataGenerator(schemaName, schemaName, collector);

  const mocked = generator.mockElement();
  const asString = JSON.stringify(mocked);

  return stripQuote(asString);
};

module.exports = {
  generateMockData,
};
