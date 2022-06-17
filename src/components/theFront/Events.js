import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Link from "next/link";
import BazarButton from "@component/BazarButton";



const Events = ({data, mainTitle, contentText}) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
      <Box>
        <Box marginBottom={4}>
          <Typography
              variant="h4"
              align={'center'}
              data-aos={'fade-up'}
              gutterBottom
              sx={{
                fontWeight: 700,
              }}
          >
            {mainTitle}
          </Typography>
          <Typography
              variant="h6"
              align={'center'}
              color={'text.secondary'}
              data-aos={'fade-up'}
          >
            {contentText}
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {data.map((item, i) => (
              <Grid
                  item
                  xs={12}
                  md={4}
                  key={i}
                  data-aos={'fade-up'}
                  data-aos-delay={i * 100}
              >
                <Box display={'block'} width={1} height={1}>
                  <Box
                      component={Card}
                      width={1}
                      height={1}
                      borderRadius={3}
                      display={'flex'}
                      flexDirection={'column'}
                  >
                    <CardMedia
                        title={item.title}
                        image={item.media}
                        sx={{
                          position: 'relative',
                          height: { xs: 240, sm: 340, md: 280 },
                          overflow: 'hidden',
                        }}
                    />
                    <CardContent>
                      <Typography
                          variant={'h6'}
                          align={'left'}
                          sx={{ fontWeight: 700 }}
                      >
                        {item.title}
                      </Typography>
                      <Box display={'flex'} alignItems={'center'} marginY={2}>
                        <Box
                            component={'svg'}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width={24}
                            height={24}
                            marginRight={1}
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </Box>
                        <Typography variant={'subtitle2'} color="text.secondary">
                          {item.location}
                        </Typography>
                      </Box>
                      <Box display={'flex'} alignItems={'center'}>
                        <Box
                            component={'svg'}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width={24}
                            height={24}
                            marginRight={1}
                        >
                            {/*<svg*/}
                            {/*    width={20}*/}
                            {/*    height={20}*/}
                            {/*    xmlns="http://www.w3.org/2000/svg"*/}
                            {/*    viewBox="0 0 20 20"*/}
                            {/*    fill="currentColor"*/}
                            {/*>*/}
                            {/*    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />*/}
                            {/*</svg>*/}
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                          />


                        </Box>
                        <Typography variant={'subtitle2'} color="text.secondary">
                          {item.phone}
                        </Typography>
                      </Box>
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        {item.actionUrl &&
                            <a href={item.actionUrl} target={item.actionTarget}>
                              <BazarButton
                                  endIcon={
                                    <Box
                                        component={'svg'}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        width={24}
                                        height={24}
                                    >
                                      <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                                      />
                                    </Box>
                                  }
                              >
                                {item.actionText}
                              </BazarButton>
                            </a>
                        }
                      </CardActions>
                    </CardContent>
                  </Box>
                </Box>
              </Grid>
          ))}
        </Grid>
      </Box>
  );
};

export default Events;
