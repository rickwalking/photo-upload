import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { Card, CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface IImageDetails {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface ImageResponse extends Card {
  data: IImageDetails[];
  after: string;
}

export default function Home(): JSX.Element {
  const fetchData = async ({ pageParam = null }): Promise<ImageResponse> => {
    const response = await api.get('api/images');

    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchData, {
    getNextPageParam: (lastPage: ImageResponse) => lastPage.after,
  });

  const formattedData = useMemo(() => {
    return data?.pages.flatMap(value => value.data);
  }, [data]);

  const loadMore = (): void => {
    fetchNextPage();
  };

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
          <Button mt="5" onClick={loadMore}>
            {isFetchingNextPage ? (
              <span>Carregando....</span>
            ) : (
              <span>Carregar mais</span>
            )}
          </Button>
        )}
      </Box>
    </>
  );
}
