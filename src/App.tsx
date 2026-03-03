import './App.css';
import * as React from 'react';
import { useEffect } from 'react';
import { TabsManager } from '@components/TabsManager/TabsManager';
import { ComponentContainer, ModalRoot } from 'vanguard';
import { useAppDispatch } from '@hooks/use-app-dispatch';
import { rcWindow } from '@stores/window.store';
import { getPathId } from '@helpers/get-path-id';
import { useSelector } from 'react-redux';
import { RootState } from '@src/main.store';
import {WPPlugin} from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Plugin/Entities/WPPlugin";

export type AppProps = {
  currentPost?: any,
  hideTabs?: boolean,
  proVersion?: boolean,
  context?: string,
}

const App = (props: AppProps) => {

  const { appLoadedModalId, plugin } = useSelector((state: RootState) => state.app);
  const pluginData: WPPlugin | undefined = plugin?.pluginData;
  const internalOnboarding: boolean = !!pluginData?.setupData?.isPluginOnboarded;

  const { currentPost } = useSelector((state:RootState) => state.post);
  const dispatch = useAppDispatch();
  const currentPostId = getPathId();
  const {currentPostType, isEditingPost} = rcWindow?.rankingCoachReactData;

  if(
    !internalOnboarding
  ) {
    props.hideTabs = true;
  }

  useEffect(() => {

    // load current post data if editing a post and it's a post or page type
    if (currentPost && isEditingPost && currentPostId && (currentPostType === 'post' || currentPostType === 'page')) {
      //
      props.currentPost = currentPost
    }
  }, [dispatch, currentPost]);

  const modalRoot = <ModalRoot
    growModals={[appLoadedModalId]}
    slideModals={[]}
    popModals={[]}
  />;

  return (
    <>
      {/* Todo: this side-effect is hide the scrool on body */}
      {/*{ modalRoot }*/}
      <ComponentContainer className={'tabs-component-container'}>
        <TabsManager key={`tabs-manager-component`} {...props} />
      </ComponentContainer>
    </>
  );
};

export default App;
