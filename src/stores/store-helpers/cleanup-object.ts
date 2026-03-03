export const cleanupObject = (obj: Record<string, any>) => {
  const newObj = { ...obj };

  for (const el in obj) {
    if (newObj.hasOwnProperty(el)) {
      const sub = newObj[el];
      if (sub && Object.keys(sub).length > 0 && typeof sub === "object") {
        delete newObj[el];
      }
    }
  }

  return newObj;
};
