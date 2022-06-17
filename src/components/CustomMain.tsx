import React from 'react'
import useAuth from "@hook/useAuth";
import HeroOne from "./theFront/HeroOne.js"
import Spaces from "./theFront/Spaces.js"
import Events from "./theFront/Events.js"
import News from "./theFront/News.js"
import LatestProducts from "./theFront/LatestProducts.js"
import Container from "@component/theFront/components/Container";
export interface CarouselCompoProps {
    contextData?: any
}

const locations = [
    {
        media: 'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2F2022-06-17%2009_26_31-B%20Happy%20Boulangerie%C2%A0%E2%80%93%C2%A0Photos.png?alt=media&token=f3879555-c46d-4dd4-9132-3bd30a41fb64',
        title: 'B.Happy Saint-Paul-de-Vence',
        phone: '04 89 97 89 75',
        location: '808 Route de la Colle, 06570 Saint-Paul-de-Vence',
        actionText: "Voir sur google map",
        actionUrl: "https://g.page/r/CSthqBEl5KhQEAE",
        actionTarget: "_new"
    },
    {
        media: 'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2FBiot_2.jpg?alt=media&token=e7f81f52-c3ca-44dd-8040-ff27adf07364',
        title: 'B.Happy Biot Migranier',
        phone: '04 93 65 00 34',
        location: '14 Chemin Neuf, 06410 Biot',
        actionText: "Voir sur google map",
        actionUrl: "https://g.page/r/CQpyeShZyCvREAE",
        actionTarget: "_new"
    },
    {
        media: 'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2F2022-06-17%2009_24_08-bhappy%20biot%20-%20Recherche%20Google.png?alt=media&token=6f9900cd-91d8-422b-8fb7-33584eb4366f',
        title: 'B.Happy Biot',
        phone: '04 97 21 73 57',
        location: '1030 Route de la Mer 06410 Biot',
        actionText: "Voir sur google map",
        actionUrl: "https://g.page/r/CYtsJ7u6WIUHEAE",
        actionTarget: "_new"
    },
    {
        media: 'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2FAntibes_1.jpg?alt=media&token=88fc4d62-1e5b-4535-974c-b05e3784f36a',
        title: 'B.Happy Antibes Route de Grasse',
        phone: '04 93 33 57 75',
        location: '2222 Route de Grasse 06600 Antibes',
        actionText: "Voir sur google map",
        actionUrl: "https://g.page/r/CTXcX1mYUhUlEAE",
        actionTarget: "_new"
    },
    {
        media: 'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2FAntibes_2.jpg?alt=media&token=65956f43-49f7-4900-87da-2b7f495d7144',
        title: 'B.Happy Antibes Av Jules Grec',
        phone: '04 93 74 01 51',
        location: '391 avenue Jules Grec 06600 Antibes',
        actionText: "Voir sur google map",
        actionUrl: "https://g.page/r/CRUW5PmWXnvpEAE",
        actionTarget: "_new"
    },
];

const news = [
    {
        newsTitle:
            "Choisissez 3 Baguettes, La 4ème, c'est cadeau",
        avatar: 'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2FBHappyPain.png?alt=media&token=f62ae013-0a80-4244-98f3-c4dbd4251493',
        actionText: "J'en profite",
        actionUrl: "/product/shop/Pains"
    },
    {
        newsTitle:
            "2 Pavés de 400 Grammes aux choix pour seuleument 4 Euros",
        avatar: 'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2F2022-03-15.png?alt=media&token=d3e9e9c3-f419-43a6-b1b3-dfcfe51c6991',
        actionText: "J'en profite",
        actionUrl: "/product/shop/Pains"
    },
    {
        newsTitle:
            "Choisissez 3 viennoiseries, La 4ème, c'est cadeau",
        avatar: 'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2F68484694_668843586923252_8291025531286061056_n.jpg?alt=media&token=414ae7be-177c-4465-a3ea-dea150fef929',
        actionText: "J'en profite",
        actionUrl: "/product/shop/Viennoiseries-et-gâteaux-secs"
    },
    {
        newsTitle:
            "Gagnez 1 point de fidélité pour chaque euro dépensé. Dès que vous avez atteint 40 points vous pouvez profiter d'une réduction de 4€",
        avatar: '/assets/images/illustrations/CustomerReward5Isometric-Agnytemp.svg',
        actionText: "Je crée mon compte",
        actionUrl: "/profile"
    },
];

const dataSpaces = [
    {
        media: [
            'https://assets.maccarianagency.com/backgrounds/img1.jpg',
            'https://assets.maccarianagency.com/backgrounds/img3.jpg',
            'https://assets.maccarianagency.com/backgrounds/img24.jpg',
            'https://assets.maccarianagency.com/backgrounds/img25.jpg',
        ],
        title: 'Soho Square',
        subtitle: 'Via E. Gola 4, 20147 Milan, Italy',
        users: [
            'https://assets.maccarianagency.com/avatars/img1.jpg',
            'https://assets.maccarianagency.com/avatars/img2.jpg',
            'https://assets.maccarianagency.com/avatars/img3.jpg',
            'https://assets.maccarianagency.com/avatars/img4.jpg',
            'https://assets.maccarianagency.com/avatars/img5.jpg',
        ],
    },
    {
        media: [
            'https://assets.maccarianagency.com/backgrounds/img3.jpg',
            'https://assets.maccarianagency.com/backgrounds/img24.jpg',
            'https://assets.maccarianagency.com/backgrounds/img25.jpg',
            'https://assets.maccarianagency.com/backgrounds/img1.jpg',
        ],
        title: 'Moose Lab',
        subtitle: 'Via Venini 33, 20150 Milan Italy',
        users: [
            'https://assets.maccarianagency.com/avatars/img1.jpg',
            'https://assets.maccarianagency.com/avatars/img2.jpg',
            'https://assets.maccarianagency.com/avatars/img3.jpg',
            'https://assets.maccarianagency.com/avatars/img4.jpg',
            'https://assets.maccarianagency.com/avatars/img5.jpg',
        ],
    },
    {
        media: [
            'https://assets.maccarianagency.com/backgrounds/img24.jpg',
            'https://assets.maccarianagency.com/backgrounds/img1.jpg',
            'https://assets.maccarianagency.com/backgrounds/img3.jpg',
            'https://assets.maccarianagency.com/backgrounds/img25.jpg',
        ],
        title: 'Tenoha Space',
        subtitle: 'Via Lagrange 5, 20175 Milan, Italy',
        users: [
            'https://assets.maccarianagency.com/avatars/img1.jpg',
            'https://assets.maccarianagency.com/avatars/img2.jpg',
            'https://assets.maccarianagency.com/avatars/img3.jpg',
            'https://assets.maccarianagency.com/avatars/img4.jpg',
            'https://assets.maccarianagency.com/avatars/img5.jpg',
        ],
    },
];


const CustomMain:React.FC<CarouselCompoProps> = ({contextData}) => {

    const {getContextDataAuth} = useAuth();

    function getContextData() {
        if (getContextDataAuth() && getContextDataAuth().brand) {
            return getContextDataAuth()
        }
        return contextData;
    }

    function getImages() {
        return [
            'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2F2021-11-24%2015_33_08-bhappy%20biot%20-%20Recherche%20Google.png?alt=media&token=f1fe6b39-3819-4d1c-b609-fe4f2d2532fd',
            'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2F198033055_1154489058358700_9058593880535696371_n.jpg?alt=media&token=a706e3be-af2e-4de5-b828-f38d6047c71e',
            'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2F68484694_668843586923252_8291025531286061056_n.jpg?alt=media&token=414ae7be-177c-4465-a3ea-dea150fef929',
            'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2F217243132_1120285761833665_1700361320755800821_n.jpg?alt=media&token=fdaf7fd5-2aa1-429d-a555-0a3cf37ce60e',
            'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2F257279162_1257852741355664_3386758678304916418_n.jpg?alt=media&token=7ba44bbb-8600-47a9-8845-6246060786fb',
            'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2F94889403_865786167228992_7255894861981679616_n%20(1).jpg?alt=media&token=79c75177-f143-4b05-82c8-3cef91472766',
            'https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/KSfP69svg0MVJWLFqljM%2Fmedias%2F83363453_801993553608254_5168303068340551680_n%20(1).jpg?alt=media&token=cdaf2e11-0dc4-49df-acd3-0ed2ec173405'
        ]
    }

    return (
        <>
            <HeroOne images={getImages()}
                     headingOne={"Boulangerie, snack, restaurant"}
                     headingOnePrimary={"B.Happy"}
                     headerText={"Vos envies pleines de vie"}
                     actionText={"Comnandez maintenant"}
                     actionUrl={"/product/shop/all"}
                    text={"B.Happy vous livre à domicile, sur votre lieu de travail"}
            />
            {/*<Box bgcolor={'secondary.main'}>*/}
            {/*    <Container>*/}
            {/*        <FeaturedProducts />*/}
            {/*    </Container>*/}
            {/*</Box>*/}
            {/*<Container>*/}
            {/*    <Spaces*/}
            {/*        data={dataSpaces}*/}
            {/*        mainTitle={"Nos points de ventes B.Happy"}*/}
            {/*    />*/}
            {/*</Container>*/}
            <Container>
                <News
                    data={news}
                    mainTitle={"Les bons plans B.Happy"}
                    contentText={"Profitez des bons plans B.Happy"}
                />
            </Container>

            <Container>
                <Events
                    data={locations}
                    mainTitle={"Nos points de ventes B.Happy"}
                />
            </Container>
            {/*<Container>*/}
            {/*    <LatestProducts*/}
            {/*        data={dataSpaces}*/}
            {/*        mainTitle={"Nos points de ventes B.Happy"}*/}
            {/*    />*/}
            {/*</Container>*/}

        </>
    )
};

export default CustomMain
