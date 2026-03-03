import { TypedDispatch } from "@src/custom-hooks/use-app-dispatch";
import { WPVariable } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Common/Entities/WPVariable";
import { MetatagsStore } from "@stores/swagger/api/MetatagsStore";
import { getPathId } from "@helpers/get-path-id";
import { AppSlice } from "@src/App.slice";
import { MetaTagsGetResponseDto } from "@src/models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/MetaTagsGetResponseDto";
import { Adornment } from "@src/components/MultiAdornmentInput/MultiSelectAdornmentInput";
import {
  WPWebPageTitleMetaTag,
  WPWebPageTitleMetaTagObjectType,
} from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageTitleMetaTag";
import { WPVariablesObjectType } from "@src/models/swagger/BeyondSEO/Domain/Integrations/WordPress/Common/Entities/WPVariables";

export const updateUIFromResponse = (response: any, dispatch: TypedDispatch<any>) => {
  if (!response?.payload || !("title" in response.payload)) return;

  const serverResponse = response.payload.title;
  const { setPreviewTitle, setSeoTitle, setParsedTitle } = AppSlice;

  if (serverResponse.parsed) {
    dispatch(setParsedTitle(serverResponse.parsed));
    dispatch(setPreviewTitle(serverResponse.parsed));
  } else {
    dispatch(setParsedTitle(null));
  }
  dispatch(setSeoTitle(serverResponse.parsed));
};

const mapAdornmentToWPVariable = (adornment: Adornment, post_id: number): WPVariable => {
  return {
    post_id: post_id,
    key: adornment.key,
    value: adornment.value,
    type: adornment.type,
    objectType:
      WPWebPageTitleMetaTagObjectType.BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_WebPages_Content_Elements_MetaTags_Tags_WPWebPageTitleMetaTag,
  };
};

export const createTitleObject = (
  titleText: string,
  post_id: number,
  variableElements?: Adornment[],
): WPWebPageTitleMetaTag => {
  return {
    content: titleText,
    postId: getPathId(),
    variables: {
      elements: variableElements
        ? variableElements.map((adornment) => mapAdornmentToWPVariable(adornment, post_id))
        : [],
      objectType: WPVariablesObjectType.BeyondSEO_Domain_Integrations_WordPress_Common_Entities_WPVariables,
    },
    objectType:
      WPWebPageTitleMetaTagObjectType.BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_WebPages_Content_Elements_MetaTags_Tags_WPWebPageTitleMetaTag,
  };
};

export const saveToServer = (
  titleText: string,
  post_id: number,
  variableElements: Adornment[],
  dispatch: TypedDispatch<any>,
  metaTagsData?: MetaTagsGetResponseDto,
) => {
  const base = createTitleObject(titleText, post_id, variableElements);

  const titleToSave: WPWebPageTitleMetaTag = {
    ...base,
    ...(metaTagsData?.title && {
      id: metaTagsData.title.id,
    }),
  };

  return dispatch(
    MetatagsStore.postApiMetatagsByPostIdThunk({
      postId: getPathId(),
      requestBody: { title: titleToSave },
      queryParams: { noCache: true },
    }),
  )
    .then((response: any) => {
      updateUIFromResponse(response, dispatch);
      return response;
    })
    .catch((error: Error) => {
      console.error("Error updating meta tags:", error);
      throw error;
    });
};
