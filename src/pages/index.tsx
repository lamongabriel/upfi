import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface FetchProjectsParams {
  pageParam?: number;
}

interface Image {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface FetchProjectsData {
  pages: {
    data: Image[];
    after: string;
  };
  pageParams: string[];
}

export default function Home(): JSX.Element {
  const fetchProjects = async ({
    pageParam = null,
  }: FetchProjectsParams): Promise<FetchProjectsData> => {
    const url = pageParam ? `/api/images?after=${pageParam}` : `/api/images`;

    const { data } = await api.get(url);

    return data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: 'images',
    queryFn: fetchProjects,
    getNextPageParam: lastPage => lastPage?.pages?.after ?? null,
  });

  const formattedData = useMemo(() => {
    if (!data || !data?.pages || data?.pages?.length === 0) {
      return [];
    }

    const informations = data.pages.flatMap(page => page?.pages?.data);

    return informations;
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
