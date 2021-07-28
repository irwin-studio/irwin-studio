import {DEFAULT_SERVER_CONFIGURATION} from '../server';
import {createServer} from '../handlers';
import {getQueryMethod} from '../utils/testing';
const pkg = require('../../package.json');

const server = createServer(DEFAULT_SERVER_CONFIGURATION);
const query = getQueryMethod(server);

describe('Root Schema', () => {
    beforeAll(() => server.start());

    describe('Queries', () => {
        describe('version', () => {
            it('should package version', async () => {
                const result = await query(`
                    query {
                        version
                    }
                `);

                expect(result.data).toMatchObject({
                    version: pkg.version,
                });
            });
        });
    });
});
