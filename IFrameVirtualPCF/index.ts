import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { IFrameControlProps } from "./components/Component.types";
import { IFrameControl } from "./components/IFrameControl";

export class IFrameVirtualPCF
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private notifyOutputChanged: () => void;
  private context: ComponentFramework.Context<IInputs>;
  isFullScreen = false;

  onFullScreen = (): void => {
    this.context.mode.setFullScreen(true);
  };
  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this.context = context;
    context.mode.trackContainerResize(true);
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   * @returns ReactElement root react element for the control
   */
  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    if (context.updatedProperties.indexOf("fullscreen_close") > -1) {
      this.isFullScreen = false;
    }
    if (context.updatedProperties.indexOf("fullscreen_open") > -1) {
      this.isFullScreen = true;
    }
    this.notifyOutputChanged();
    return React.createElement(IFrameControl, this.getIframeProps(context));
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
  private getIframeProps(context: ComponentFramework.Context<IInputs>) {
    const allocatedWidth = parseInt(
      context.mode.allocatedWidth as unknown as string
    );
    const allocatedHeight = parseInt(
      context.mode.allocatedHeight as unknown as string
    );

    return {
      src: undefinedIfEmpty(context.parameters.src),
      width: allocatedWidth,
      height: allocatedHeight,
      isFullScreen: this.isFullScreen,
      onFullScreen: this.onFullScreen,
      showFullScreenBtn: context.parameters.FullscreenButton.raw,
    } as IFrameControlProps;
  }
}

function undefinedIfEmpty(property: ComponentFramework.PropertyTypes.Property) {
  return defaultIfEmpty(property, undefined);
}

function defaultIfEmpty<T>(
  property: ComponentFramework.PropertyTypes.Property,
  defaultValue: T
) {
  return (property.raw as T) ? property.raw : defaultValue;
}
