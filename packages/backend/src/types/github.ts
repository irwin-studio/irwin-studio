export interface GithubStats {
    username: string;
    contributions: Contributions;
}

export interface Contributions {
    total: number;
    commits: number[];
    from: Date;
    to: Date;
}
