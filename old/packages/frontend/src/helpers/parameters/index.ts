export enum Type {
    NUMBER,
}

interface TypeMappings {
    [Type.NUMBER]: number;
}

interface BaseValues<ValueType extends Type> {
    type: ValueType;
    value: TypeMappings[ValueType];
}

export interface Parameter {
    [Type.NUMBER]: {
        step: number;
        min: number;
        max: number;
    } & BaseValues<Type.NUMBER>;
}

export interface ParameterSchema {
    [key: string]: Parameter[Type];
}
