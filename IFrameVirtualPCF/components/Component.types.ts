export interface IFrameControlProps {
  src: string;
  frameBorder: string;
  width: number;
  height: number;
  onFullScreen: () => void;
  isFullScreen: boolean;
  showFullScreenBtn?: boolean;
}
