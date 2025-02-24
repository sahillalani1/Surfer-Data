import { GitBranch, GitCommit, GitPullRequest, Users, Code, Book, Mail, Folder, MessageSquare, User, Twitter, FileText, Briefcase, AtSign } from 'lucide-react';
import GithubLight from '../components/assets/platforms/GithubLight';
import GithubDark from '../components/assets/platforms/GithubDark';
import SlackLight from '../components/assets/platforms/SlackLight';
import SlackDark from '../components/assets/platforms/SlackDark';
import XLight from '../components/assets/platforms/XLight';
import XDark from '../components/assets/platforms/XDark';
import LinkedInLight from '../components/assets/platforms/LinkedInLight';
import LinkedInDark from '../components/assets/platforms/LinkedInDark';
import GmailLight from '../components/assets/platforms/GmailLight';
import GmailDark from '../components/assets/platforms/GmailDark';
import NotionLight from '../components/assets/platforms/NotionLight';
import NotionDark from '../components/assets/platforms/NotionDark';
import { IPlatform } from '../types/interfaces';


export const platforms: IPlatform[] = [
  {
    id: 'github-001',
    name: 'GitHub',
    logo: {
      light: GithubLight,
      dark: GithubDark,
    },
    company: 'Microsoft',
    companyLogo: '/assets/logos/microsoft.svg',
    isConnected: true,
    home_url: 'https://github.com',
    subRuns: [
      {
        id: 'github-001-repos',
        name: 'Repositories',
        icon: GitBranch,
        description: 'Extracts all repositories',
        extractionMethod: 'GitHub API v3 - /user/repos endpoint',
        tasks: [
          {
            id: 'github-001-repos-task-1',
            name: 'Fetch Repository List',
            steps: [
              { id: 'step-1', name: 'Make API request', status: 'pending' },
              { id: 'step-2', name: 'Parse response', status: 'pending' },
              { id: 'step-3', name: 'Save repository list', status: 'pending' },
            ],
            status: 'pending',
          },
          {
            id: 'github-001-repos-task-2',
            name: 'Fetch Repository Details',
            steps: [
              { id: 'step-1', name: 'Make API request', status: 'pending' },
              { id: 'step-2', name: 'Parse response', status: 'pending' },
              { id: 'step-3', name: 'Save repository details', status: 'pending' },
            ],
            status: 'pending',
          },
        ],
      },
      {
        id: 'github-001-commits',
        name: 'Commits',
        icon: GitCommit,
        description: 'Extracts commit history',
        extractionMethod: 'GitHub API v3 - /repos/{owner}/{repo}/commits endpoint',
        tasks: [
          {
            id: 'github-001-commits-task-1',
            name: 'Fetch Commit History',
            steps: [
              { id: 'step-1', name: 'Make API request', status: 'pending' },
              { id: 'step-2', name: 'Parse response', status: 'pending' },
              { id: 'step-3', name: 'Save commit history', status: 'pending' },
            ],
            status: 'pending',
          },
        ],
      },
      { id: 'github-001-prs', name: 'Pull Requests', icon: GitPullRequest, description: 'Extracts all pull requests', extractionMethod: 'GitHub API v3 - /repos/{owner}/{repo}/pulls endpoint', tasks: [] },
      { id: 'github-001-branches', name: 'Branches', icon: GitBranch, description: 'Extracts branch information', extractionMethod: 'GitHub API v3 - /repos/{owner}/{repo}/branches endpoint', tasks: [] },
      { id: 'github-001-users', name: 'Users', icon: Users, description: 'Extracts user data', extractionMethod: 'GitHub API v3 - /users/{username} endpoint', tasks: [] },
      { id: 'github-001-code', name: 'Code', icon: Code, description: 'Extracts all code files', extractionMethod: 'GitHub API v3 - /repos/{owner}/{repo}/contents endpoint', tasks: [] },
      { id: 'github-001-wikis', name: 'Wikis', icon: Book, description: 'Extracts wiki pages', extractionMethod: 'GitHub API v3 - /repos/{owner}/{repo}/wiki/pages endpoint', tasks: [] },
    ],
    supportedOS: ['mac', 'windows', 'linux'],
  },
  {
    id: 'gmail-001',
    name: 'Gmail',
    logo: {
      light: GmailLight,
      dark: GmailDark,
    },
    company: 'Google',
    companyLogo: '/assets/logos/google.svg',
    isConnected: true,
    home_url: 'https://mail.google.com',
    subRuns: [
      {
        id: 'gmail-001-all',
        name: 'All Email',
        icon: Mail,
        description: 'Extracts all emails',
        extractionMethod: 'The general approach here is to use Google Takeout to request a full export of all your emails, then download the MBOX file that gets sent to Gmail and convert the MBOX file to JSON.',
        tasks: [
          {
            id: 'gmail-001-all-task-1',
            name: 'Google Takeout',
            steps: [
              { id: 'step-1', name: 'Navigate to Google Takeout', status: 'pending' },
              { id: 'step-2', name: 'Wait for export to complete', status: 'pending' },
              { id: 'step-3', name: 'Download exported file', status: 'pending' },
            ],
            status: 'pending',
          },
          {
            id: 'gmail-001-all-task-2',
            name: 'Convert MBOX to JSON',
            steps: [
              { id: 'step-1', name: 'Parse MBOX file', status: 'pending' },
              { id: 'step-2', name: 'Convert to JSON format', status: 'pending' },
              { id: 'step-3', name: 'Save JSON file', status: 'pending' },
            ],
            status: 'pending',
          },
        ],
      },
    ],
    supportedOS: ['mac', 'windows', 'linux'],
  },
  // {
  //   id: 'slack-001',
  //   name: 'Slack',
  //   logo: {
  //     light: SlackLight,
  //     dark: SlackDark,
  //   },
  //   company: 'Salesforce',
  //   companyLogo: '/assets/logos/salesforce.png',
  //   isConnected: true,
  //   home_url: 'https://app.slack.com',
  //   subRuns: [
  //     { id: 'slack-001-messages', name: 'Messages', icon: MessageSquare, description: 'Extracts all messages', extractionMethod: 'Slack API - /chat.postMessage endpoint', tasks: [] },
  //     { id: 'slack-001-channels', name: 'Channels', icon: MessageSquare, description: 'Extracts channel information', extractionMethod: 'Slack API - /conversations.list endpoint', tasks: [] },
  //     { id: 'slack-001-users', name: 'Users', icon: Users, description: 'Extracts user data', extractionMethod: 'Slack API - /users.list endpoint', tasks: [] },
  //   ],
  //   supportedOS: ['mac', 'windows', 'linux'],
  // },
  {
    id: 'notion-001',
    name: 'Notion',
    logo: {
      light: NotionLight,
      dark: NotionDark,
    },
    company: 'Notion',
    companyLogo: '/assets/logos/notion.png',
    isConnected: true,
    home_url: 'https://notion.so',
    subRuns: [
      { id: 'notion-001-pages', name: 'Pages', icon: FileText, description: 'Extracts all pages', extractionMethod: 'Notion API - /pages endpoint', tasks: [] },
      { id: 'notion-001-databases', name: 'Databases', icon: Folder, description: 'Extracts all databases', extractionMethod: 'Notion API - /databases endpoint', tasks: [] },
      { id: 'notion-001-users', name: 'Users', icon: Users, description: 'Extracts user data', extractionMethod: 'Notion API - /users endpoint', tasks: [] },
    ],
    supportedOS: ['mac', 'windows', 'linux'],
  },
  {
    id: 'linkedin-001',
    name: 'LinkedIn',
    logo: {
      light: LinkedInLight,
      dark: LinkedInDark,
    },
    company: 'Microsoft',
    companyLogo: '/assets/logos/microsoft.png',
    isConnected: true,
    home_url: 'https://linkedin.com/feed',
    subRuns: [
      { id: 'linkedin-001-profile', name: 'Profile', icon: User, description: 'Extracts profile information', extractionMethod: 'LinkedIn API - /me endpoint', tasks: [] },
      { id: 'linkedin-001-connections', name: 'Connections', icon: Users, description: 'Extracts connection data', extractionMethod: 'LinkedIn API - /connections endpoint', tasks: [] },
      { id: 'linkedin-001-posts', name: 'Posts', icon: FileText, description: 'Extracts user posts', extractionMethod: 'LinkedIn API - /posts endpoint', tasks: [] },
      { id: 'linkedin-001-jobs', name: 'Job Applications', icon: Briefcase, description: 'Extracts job application history', extractionMethod: 'LinkedIn API - /jobs endpoint', tasks: [] },
    ],
    supportedOS: ['mac', 'windows', 'linux'],
  },
  {
    id: 'twitter-001',
    name: 'Twitter',
    logo: {
      light: XLight,
      dark: XDark,
    },
    company: 'X Corp',
    companyLogo: '/assets/logos/x.png',
    isConnected: true,
    home_url: 'https://x.com/home',
    subRuns: [
      { id: 'twitter-001-tweets', name: 'Tweets', icon: Twitter, description: 'Extracts all tweets', extractionMethod: 'Twitter API - /tweets endpoint', tasks: [] },
      { id: 'twitter-001-followers', name: 'Followers', icon: Users, description: 'Extracts follower data', extractionMethod: 'Twitter API - /followers endpoint', tasks: [] },
      { id: 'twitter-001-following', name: 'Following', icon: Users, description: 'Extracts following data', extractionMethod: 'Twitter API - /following endpoint', tasks: [] },
      { id: 'twitter-001-dms', name: 'Direct Messages', icon: Mail, description: 'Extracts direct messages', extractionMethod: 'Twitter API - /direct_messages endpoint', tasks: [] },
    ],
    supportedOS: ['mac', 'windows', 'linux'],
  },
];
