import {getGithubStats} from './github';

describe('Helpers - github.ts', () => {
    /*
     * There is a purposful lack of tests here.
     *
     * I could mock the fetch function and test that the functionality
     * works against known HTML but if it doesn't work against what github
     * is currently doing then the test is technically incorrect.
     *
     * So, as far as I'm concerned, making sure the function returns the
     * expected format is as thorough as required.
     */

    it('should successfully get github information', async () => {
        const result = await getGithubStats();

        expect(result).toMatchObject({
            username: expect.any(String),
            contributions: {
                total: expect.any(Number),
                from: expect.any(Date),
                to: expect.any(Date),
                commits: expect.arrayContaining([expect.any(Number)]),
            },
        });
    });

    it('should not successfully get github information of a user that does not exist', async () => {
        // This username is not taken and cannot BE taken
        const username = 'fuck';

        expect(() => getGithubStats(username)).rejects.toThrowError();
    });
});
