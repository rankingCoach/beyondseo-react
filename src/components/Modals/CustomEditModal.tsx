import {EditModal} from "vanguard";

export const CustomEditModal = (props: any) => {
  const { close } = props;
  return (
    <>
      <EditModal
        title={"Edit business details"}
        close={close}
        closeOnSave={false}
        savable={false}
        saveCallback={() => {
        }}
        cancelCallback={() => {
        }}
        savingInProgress={true}
        requestGotError={true}
        testId={"business-profile-details-edit-modal"}
      >
        Some content
      </EditModal>
    </>
  );
};
