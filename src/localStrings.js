import LocalizedStrings from 'react-localization';
import React from 'react';
import {formatOrderConsumingMode} from "./util/displayUtil";

let localStrings = new LocalizedStrings({
    fr: {
        warning: "Attention",
        information: "Information",
        viewAllCat: "Voir toute les categories",
        backToCart: "Revenir au panier",

        phone: "Telephone",
        bookWithoutAccount: "Commander sans creer de compte",
        profileInformation: "Information de compte",
        tooFarAddress: "Adresse en dehors de la zone de livraison",
        formatDuration: "HH [heure(s) et] mm [minute(s)]",
        formatDurationNoHour: "mm [minute(s)]",

        distanceTime: "distance jusqu'a l'etablissement: {0} km / {1}",
        timeSlot: "Creneau de reservation",
        priceDetail: "Montant a payer",
        totalNoTax: "Total hors taxes",
        totalTax: "Total taxes",
        totalTTC: "Total TTC",
        deliveryFee: "Frais de livraisons",

        deliverToOtherAddress: "Livrer a une autre adresse",
        validateAdress: "Valider l'adresse",
        clickAndCollect: "Click and collect",
        delivery: "Livraison",
        deliveryMode: "Mode de livraison",
        cart: "Panier",
        confirm: "Confirmation",
        order: "Commande",
        categories: "Categories",
        tags: "Tags",
        selectDeal: "Choisir le detail",
        cancel: "Annuller",
        next: "Selectionner le produit suivant",
        select: "Selectionner le produit",
        addMenuToCart: "Ajouter le menu au panier",
        checkOutNow: "Commander",
        viewCart: "Voir le detail du panier",
        emptyBasket: "Votre panier est vide",
        cartItemNumber: "{0} produits dans le panier",
        selectOptions: "Choisir les options",
        deals: "Menu et offres",
        sortBy: "Trier par ",
        ourProducts: "Nos produits",
        view: "Vue",
        allCategories: "Toutes les categories",
        category: "Categorie",
        categorie: "Categories",
        searchResults: 'Resultats de recherche pour: "{0}"',
        searchFor: "Rechercher un produit ....",
        continueWithGoogle: "Continuer avec google",
        continueWithFaceook: "Continuer avec facebook",
        profile: "Profile",
        myAccount: "Mon compte",
        myOrders: "Mes commandes",
        myAdresse: "Mon adresse",
        account: "Compte",
        logout: "Se deconnecter",
        logEmailAndPassword: "Se connecter avec email et mot de passe",
        dontHaveAccount: "Vous n'avez pas de compte?",
        signup: "Creer un compte",
        resetPassword: "Réinitialiser le mot de passe",
        forgotPassword: "Mot de passe oublié",
        address: "Adresse",
        deliveryAdress: "Adresse de livraison",
        email: "Email",
        firstName: "Prenom",
        lastName: "Nom",
        termsAndConditions: "Termes et conditions",
        activateAccount: "Activer mon compte",
        fillInfoToContinue: "Reseignez les champs pour continuer",
        login: "Se connecter",
        bySigningTermsAndConditions: "En cochant cette cas vous acceptez les termes et conditions",
        requiredField: "Le champ {0} est obligatoire",
        addToCart: "Ajouter au panier",
        description: "Description",
        additionalInformation: "Information additionelle",
        priceAsc: "Prix croissant",
        priceDesc: "Prix décroissant",

        orderSourceOnline: "Commande internet",
        orderSourceOffline: "Commande restaurant",

        deliveryStatusOnGoing: "On going",
        deliveryStatusNotStarted: "Not started",
        deliveryStatusDone: "Done",

        orderStatusNew: "Nouveau",
        orderStatusPreparation: "Prepararation",
        orderStatusReady: "Pret",
        orderStatusDelivering: "En livraison",
        orderStatusComplete: "Finalisé",
        orderStatusFinished: "Terminé",

        paymentMethodsOffline: "Offline payment methods",
        paymentMethodsOnline: "Online payment methods",
        paymentMethodCash: "Cash",
        paymentMethodCC: "Credit card",
        paymentMethodCheque: "Cheque",
        paymentMethodTicket: "Ticket",
        paymentMethodStripe: "Stripe",

        check: {
            fieldRequired: "Le champ {0} est obligatoire",
            required: "Obligatoire",
            requiredField: "Champ obligatoire",
            badPhoneFormat: "Numero de telephone invalide",
        },

        info: {
            checkAddessInfo: "Afin de savoir si votre etes eligible à la livraison à domicile, merci de fournir une adresse",
            connectToOrder: 'Afin de garder une trace de vos commandes et de garantir un meilleur suivi, la commande doit se faire en mode connecté. Si vous avez un compte Google ou Facebook <strong>cela ne prendra que quelques secondes !!</strong>'
        },

        warningMessage: {
            maxDistanceDelivery: "L'adresse est en dehors de la zone de livraison mais vous pouvez toujours commander en mode click and collect",
            maxDistanceDeliveryOk: "L'adresse est dans de la zone de livraison",
            selectValidDeliveryAddressAndSchedule: "Selectionner une addresse de livraison valide et un creaneau de reservation",
        },

        notif: {
            accountCreated: "Compte cree",
            dealAddedToCart: "Offre ajouté au panier",
            productAddedToCart: "Produit ajouté au panier",
        }

    }
});

export default localStrings;