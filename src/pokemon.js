import React, { Component } from 'react';
import {
    Grid, Card, CardMedia, CardContent, Typography,
    ListItem, ListItemText, List, ImageList
} from '@mui/material';

export default class Pokemon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pokemonData: [],
            isLoading: true,
            page: 1,
            pageSize: 10,
            reachedLastPage: false             
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        const { page, pageSize, pokemonData } = this.state
        fetch(
            `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=${pageSize}`)
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    pokemonData: [...pokemonData, ...json.data],
                    isLoading: false,
                    page: page + 1,
                    reachedLastPage: pokemonData.length + json.data.length === json.totalCount
                });
            });
    }

    componentWillMount(){
        window.addEventListener('scroll', this.loadMore);
      }
      
      componentWillUnmount(){
          window.removeEventListener('scroll', this.loadMore);
      }

      loadMore = () => {
        if ((window.innerHeight + document.documentElement.scrollTop + 1 >= document.scrollingElement.scrollHeight ) && !this.state.reachedLastPage) {
            this.fetchData();
        }
    }


    render() {
        const { pokemonData, isLoading } = this.state;
        console.log('pokemonData' + JSON.stringify(this.state.pokemonData));
        return (
            <Grid container xs={12} style={{ backgroundColor: 'aqua' }}>
                {!isLoading && pokemonData.map((data) => {
                    return (
                        <Grid item xs={3} style={{margin:'3rem'}}>
                            <Card style={{ width: '300px', margin: '3rem', padding: '1rem' }}>
                                <CardMedia
                                    // style={{border:'5px solid gold', borderRadius:'3%'}}
                                    component="img"
                                    image={data.images.small}
                                    alt="Paella dish"
                                />
                                <CardContent>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography style={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '1rem' }}>{data.name}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography style={{ textAlign: 'right' }}><span style={{ fontWeight: 'bold' }}>HP :</span> {data.hp}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Typography style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '14px' }}>Attacks:</Typography>
                                    <Typography style={{textAlign: 'left'}}>
                                    {data && data.attacks && data.attacks.map((attack) => {
                                        return(
                                            <span style={{ fontSize: '14px' }}>{attack.name}, </span>
                                        )
                                    })}
                                    </Typography>
                                    <Typography style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '14px' }}>Abilities:</Typography>
                                    <Typography style={{ textAlign: 'left'}}>
                                    {data && data.abilities && data.abilities.map((ability) => {
                                        
                                        return (
                                            <span style={{fontSize: '14px' }}>{ability.name}</span>
                                        )
                                    })}
                                    </Typography>
                                </CardContent>

                            </Card>
                        </Grid>
                    )
                })}

            </Grid>
        )
    }
}
