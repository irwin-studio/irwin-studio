import type { RendererCanvasMetaData } from '.';
import { Info } from './info';
import type { Vec2, MaybeVec2 } from './vec2';

export type ShapeTheme = {
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
}
 
export type ShapeThemes<T extends string | undefined = undefined> =
  Record<'default', ShapeTheme> & (
    T extends undefined
      ? Record<'default', ShapeTheme>
      : Partial<Record<NonNullable<T>, ShapeTheme | undefined>>
  )

export type ShapeConfig<States extends string> = {
  stage?: 'SCREEN' | 'CANVAS'
  parallax?: number
  themes?: ShapeThemes<D<States>>
}

export const DEFAULT_CONFIG: ShapeConfig<'default'> = {
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

type D<UTheme extends string> = 'default' | UTheme;

/**
 * Where UStates is a string union of possible states the shape can have
 */
export class Shape<UThemes extends string> extends Info {
  /**
   * the position relative to the origin (0, 0) - just X,Y coords.
   * This does not account for any screenspace offset
   * */
  position: Vec2;
  config: ShapeConfig<D<UThemes>>
  theme: D<UThemes>

  constructor(position: Vec2, state?: D<UThemes>, config?: ShapeConfig<UThemes>) {
    super();

    this.theme = state ?? 'default';
    this.position = position;
    this.config = config ?? DEFAULT_CONFIG
    this.config.themes = this.config.themes ?? DEFAULT_CONFIG.themes
    this.config.parallax = config?.parallax ?? 1
  }

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

  setTheme(theme: D<UThemes>) {
    this.theme = theme
  }
}

export interface IShape<UStates extends string = string> extends Shape<UStates> {
  draw(context: CanvasRenderingContext2D, metadata: RendererCanvasMetaData): void;
}
