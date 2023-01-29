import { mdiArrowBottomLeft, mdiArrowTopRight, mdiStop } from "@mdi/js";
import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import { classMap } from "lit/directives/class-map";
import { supportsFeature } from "../common/entity/supports-feature";
import {
  canCloseTilt,
  canCloseTiltUp,
  canStopTilt,
  CoverEntity,
  CoverEntityFeature,
  supportsCloseTiltUp,
} from "../data/cover";
import { HomeAssistant } from "../types";
import "./ha-icon-button";

@customElement("ha-cover-tilt-controls")
class HaCoverTiltControls extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) stateObj!: CoverEntity;

  protected render(): TemplateResult {
    if (!this.stateObj) {
      return html``;
    }

    return html` <ha-icon-button
        class=${classMap({
          invisible: !supportsFeature(
            this.stateObj,
            CoverEntityFeature.OPEN_TILT
          ),
        })}
        .label=${this.hass.localize(
          "ui.dialogs.more_info_control.cover.open_tilt_cover"
        )}
        .path=${mdiArrowTopRight}
        @click=${this._onTiltUpTap}
        .disabled=${!canCloseTiltUp(this.stateObj)}
      ></ha-icon-button>
      <ha-icon-button
        class=${classMap({
          invisible: !supportsFeature(
            this.stateObj,
            CoverEntityFeature.STOP_TILT
          ),
        })}
        .label=${this.hass.localize(
          "ui.dialogs.more_info_control.cover.stop_cover"
        )}
        .path=${mdiStop}
        @click=${this._onStopTiltTap}
        .disabled=${!canStopTilt(this.stateObj)}
      ></ha-icon-button>
      <ha-icon-button
        class=${classMap({
          invisible: !supportsFeature(
            this.stateObj,
            CoverEntityFeature.CLOSE_TILT
          ),
        })}
        .label=${this.hass.localize(
          "ui.dialogs.more_info_control.cover.close_tilt_cover"
        )}
        .path=${mdiArrowBottomLeft}
        @click=${this._onTiltDownTap}
        .disabled=${!canCloseTilt(this.stateObj)}
      ></ha-icon-button>`;
  }

  private _onTiltUpTap(ev): void {
    ev.stopPropagation();
    if (supportsCloseTiltUp(this.stateObj) && this.stateObj.attributes.current_tilt_position! >= 50) {
      this.hass.callService("cover", "close_cover_tilt_up", {
        entity_id: this.stateObj.entity_id,
      });
    } else {
      this.hass.callService("cover", "open_cover_tilt", {
        entity_id: this.stateObj.entity_id,
      });
    }
  }

  private _onTiltDownTap(ev): void {
    ev.stopPropagation();
    if (supportsCloseTiltUp(this.stateObj) && this.stateObj.attributes.current_tilt_position! >= 50) {
      this.hass.callService("cover", "open_cover_tilt", {
        entity_id: this.stateObj.entity_id,
      });
    } else {
      this.hass.callService("cover", "close_cover_tilt", {
        entity_id: this.stateObj.entity_id,
      });
    }
  }

  private _onStopTiltTap(ev): void {
    ev.stopPropagation();
    this.hass.callService("cover", "stop_cover_tilt", {
      entity_id: this.stateObj.entity_id,
    });
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        white-space: nowrap;
      }
      .invisible {
        visibility: hidden !important;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-cover-tilt-controls": HaCoverTiltControls;
  }
}
