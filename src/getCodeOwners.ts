import { Context } from '@actions/github/lib/context'
    
export async function getCodeOwners(context: Context, token: string) {
  const repoParams = {repo: context.repo.repo, owner: context.repo.owner}
  const authParams = {type: 'token', token: token}

  const codeOwnersApi = new Codeowner(repoParams);

  let codeownersmap = codeOwnersApi.getCodeownersMap()
  let codeowners:Set<string> = new Set([""]) 
  for (let entry of codeownersmap) {
    codeowners.add(entry.owners)
}

}

const mapCodeownersFile = (codeownersFileContent: string): MappedData[] => {
  return codeownersFileContent
      .split('\n')
      .filter(x => x && !x.startsWith('#'))
      .map(x => {
          const line = x.trim();
          const [path, ...owners] = line.split(/\s+/);
          return {path, owners};
      });
};

type MappedData = {
  path: string;
  owners: string[];
};
