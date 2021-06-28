import {merge} from 'lodash';

const types = [require('./root').default, require('./date').default, require('./github').default];

export const resolvers = types.map(({resolvers}) => resolvers);
export const typeDefs = merge(types.map(({typeDefs}) => typeDefs));
