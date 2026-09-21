import React from 'react';
import { MiniseriesFeFlowStudio } from './MiniseriesFeFlowStudio';

interface GoogleFlowVideoCreatorProps {
  onSendToVideoStudio?: (videoPackage: any) => void;
  onNavigateToSpiritualCreator?: () => void;
}

export const GoogleFlowVideoCreator: React.FC<GoogleFlowVideoCreatorProps> = (props) => {
  return <MiniseriesFeFlowStudio {...props} />;
};

export default GoogleFlowVideoCreator;
