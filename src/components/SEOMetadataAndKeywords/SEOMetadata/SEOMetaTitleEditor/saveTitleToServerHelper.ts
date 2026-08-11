import { TypedDispatch } from "@src/custom-hooks/use-app-dispatch";
import { MetatagsStore } from "@stores/swagger/api/MetatagsStore";
import { getPathId } from "@helpers/get-path-id";
import { MetaTagsPostRequestDto } from "@src/models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/MetaTagsPostRequestDto";
import { StructuredTemplate } from "@src/types/meta-tags";

/**
 * Persist the SEO title as a structured template array
 * (`[{type:'text',content}, {type:'variable',key}, {type:'separator',key}]`).
 *
 * The live preview is computed client-side by the editor before this call;
 * the response (the full meta tags payload) is applied to the store by the
 * `postApiMetatagsByPostIdThunk.fulfilled` reducer.
 */
export const saveTitleToServer = (template: StructuredTemplate, dispatch: TypedDispatch<any>) => {
  return dispatch(
    MetatagsStore.postApiMetatagsByPostIdThunk({
      postId: getPathId(),
      requestBody: { title: { template } } as unknown as MetaTagsPostRequestDto,
      queryParams: { noCache: true },
    }),
  ).catch((error: Error) => {
    console.error("Error updating meta tags:", error);
    throw error;
  });
};
