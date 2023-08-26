import type { CoorindateContext, RenderMetaData } from '.';
import { Info } from './info';
import { Vec2, type MaybeVec2 } from './vec2';

export type ShapeTheme = {
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
}

export type ShapeConfig = {
  stage?: CoorindateContext
  parallax?: number
  themes?: Record<string, ShapeTheme>
}

export const DEFAULT_CONFIG: ShapeConfig = {
  stage: 'CANVAS',
  parallax: 1,
  themes: {
    default: {
      strokeColor: "black",
      fillColor: "white",
      strokeWidth: 1
    }
  }
}

/**
 * Where UStates is a string union of possible states the shape can have
 */
export abstract class Shape extends Info {
  /**
   * the position relative to the origin (0, 0) - just X,Y coords.
   * This does not account for any screenspace offset
   * */
  position: Vec2;
  config: ShapeConfig
  theme: string

  constructor(position: MaybeVec2, state?: string, config?: ShapeConfig) {
    super();

    this.theme = state ?? 'default';
    this.position = Vec2.coerce(position);
    this.config = config ?? DEFAULT_CONFIG
    this.config.themes = this.config.themes ?? DEFAULT_CONFIG.themes
    this.config.parallax = config?.parallax ?? 1
  }

  abstract draw(context: CanvasRenderingContext2D, metadata: RenderMetaData): void;
  abstract isWithin(vec2: Vec2): boolean;

  setPos(vec2: MaybeVec2) {
    this.position.moveTo(vec2);
  }

  getStyle(): ShapeTheme | undefined {
    const styles: Record<string, ShapeTheme | undefined> = this.config.themes ?? {}
    if (this.theme in styles){
      return styles[this.theme];
    } else {
      return styles.default;
    }
  }

  setTheme(theme: string) {
    this.theme = theme
  }

  
}
