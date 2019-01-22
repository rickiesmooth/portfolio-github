
import { normalizeRepos } from "./api";

const userFixture = require("./user.fixtures.json");
const collaboratorsFixture = require("./collaborator.fixtures.json");

(fetch as any).mockImplementation((url: string) => {
    if (url === 'https://api.github.com/users/rickiesmooth/repos') {
        return Promise.resolve(new Response(JSON.stringify(userFixture)))
    }

    if (url === "https://api.github.com/repos/rickiesmooth/botkit/contributors") {
        return Promise.resolve(new Response(JSON.stringify(collaboratorsFixture)))
    }
})

describe("testing api", () => {
    it('should properly decorate the fullName', async () => {
        await normalizeRepos("rickiesmooth").then(res => {
            const repo = res.repos[0]

            expect(res.error).toBeNull
            expect(res.repos).toBeTruthy

            expect(repo.name).toEqual("rickiesmooth/botkit")
            expect(repo.contributors[0]).toEqual({
                avatar_url: "https://github.com/images/error/octocat_happy.gif",
                contributions: 1,
                html_url: "https://github.com/octocat",
                login: "octocat"
            })
        });
    });

})
