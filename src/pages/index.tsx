import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface GetImagesAPIResponse {
  data: {
    id: string;
    title: string;
    description: string;
    ts: number;
    url: string;
  }[];
  after?: string;
}

export default function Home(): JSX.Element {
  const fetchProjects = async ({
    pageParam = null,
  }): Promise<GetImagesAPIResponse> => {
    const { data: images } = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });

    return images;
  };

  function getNextPageParam({ after }: GetImagesAPIResponse): string | null {
    return after || null;
  }

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
    getNextPageParam,
  });

  const formattedData = useMemo(() => {
    if (!data || !data?.pages) return [];

    return data.pages.map(page => page.data).flat(1);
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
        {formattedData?.length > 0 && <CardList cards={formattedData} />}
        {hasNextPage && (
          <Button
            mt={8}
            role="button"
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            loadingText="Carregando..."
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
