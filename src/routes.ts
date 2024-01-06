import type {
  ListDeploymentsParams,
  ListTeamsParams,
  ListUserEventsParams,
  DomainAvailableParams,
  DomainPriceParams,
  GetTeamParams,
  DeleteTeamParams,
  AssignAliasParams,
  DeleteAliasParams,
  GetAliasParams
} from './types';

type PartialParams = Record<string, any>;

/**
 * Vercel API Endpoints.
 * @see https://vercel.com/docs/rest-api/endpoints
 */
const Routes = {
  USER: {
    GET() {
      return 'https://api.vercel.com/v2/user';
    },

    DELETE() {
      return 'https://api.vercel.com/v1/user';
    },

    LIST_EVENTS(params?: ListUserEventsParams) {
      const query = new URLSearchParams(params as PartialParams).toString();
      return `https://api.vercel.com/v3/events${query ? `?${query}` : ''}`;
    }
  },

  DEPLOYMENTS: {
    LIST(params?: ListDeploymentsParams) {
      const query = new URLSearchParams(params as PartialParams).toString();
      return `https://api.vercel.com/v6/deployments${query ? `?${query}` : ''}`;
    }
  },

  TEAMS: {
    LIST(params?: ListTeamsParams) {
      const query = new URLSearchParams(params as PartialParams).toString();
      return `https://api.vercel.com/v2/teams${query ? `?${query}` : ''}`;
    },

    GET(params?: GetTeamParams) {
      let url = `https://api.vercel.com/v2/teams/${params?.teamId || ''}`;

      if (params?.slug) {
        url += `?slug=${params.slug}`;
      }

      return url;
    },

    CREATE() {
      return 'https://api.vercel.com/v1/teams';
    },

    DELETE(params: Omit<DeleteTeamParams, 'reasons'>) {
      if (!params.teamId) {
        throw new Error('Team ID must be provided');
      }

      const withNewDefaultTeamId = `?newDefaultTeamId=${params.newDefaultTeamId}`;

      return `https://api.vercel.com/v1/teams/${params.teamId}${
        params.newDefaultTeamId ? withNewDefaultTeamId : ''
      }`;
    }
  },

  ALIASES: {
    ASSIGN(params: Pick<AssignAliasParams, 'id'>) {
      if (!params.id) {
        throw new Error('Deployment ID must be provided');
      }

      return `https://api.vercel.com/v2/deployments/${params.id}/aliases`;
    },

    DELETE(params: DeleteAliasParams) {
      if (!params.aliasId) {
        throw new Error('Alias ID must be provided');
      }

      const withTeamId = `?teamId=${params.teamId}`;

      return `https://api.vercel.com/v2/aliases/${params.aliasId}/${
        params.teamId ? withTeamId : ''
      }`;
    },

    GET(params: GetAliasParams) {
      if (!params.idOrAlias) {
        throw new Error('Alias or Alias ID must be provided');
      }

      const query = new URLSearchParams(params as PartialParams).toString();
      return `https://api.vercel.com/v4/aliases/${params.idOrAlias}${query ? `?${query}` : ''}`;
    }
  },

  DOMAINS: {
    AVAILABLE(params: DomainAvailableParams) {
      if (!params.name) {
        throw new Error('Domain name must be provided');
      }

      const query = new URLSearchParams(params as PartialParams).toString();
      return `https://api.vercel.com/v4/domains/status?${query}`;
    },

    PRICE(params: DomainPriceParams) {
      if (!params.name) {
        throw new Error('Domain name must be provided');
      }

      const query = new URLSearchParams(params as PartialParams).toString();
      return `https://api.vercel.com/v4/domains/price?${query}`;
    }
  }
};

export default Routes;
