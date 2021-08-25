import LocalizedStrings from 'react-localization';
import React from 'react';
import {formatOrderConsumingMode} from "./util/displayUtil";

let localStrings = new LocalizedStrings({
    fr: {
        refresh: "Actualiser",
        deliveryEstimateDate: "Date de livraison estimée: {0}",
        orderDate: "Date de commande",
        deliveryHour: "Heure de livraison prévu",
        orderDetail: "Detail de la commande",
        total: "Total",
        mandatorySelection: "(Selection obligatoire)",

        optionListWithLimitMinMax: "Option {0} selectionnez minimum {1} option(s) et maximum {2} {3}",
        optionListWithLimitMin: "Option {0} selectionnez minimum {1} option(s) {2}",
        optionListWithLimitMax: "Option {0} selectionnez maximum {1} option(s) {2}",
        optionListWithLimit: "Option {0} {1}",

        mandatoryOption: "(obligatoire)",
        sendLinkAgain: "Ré-envoyer le lien d'activation",
        backToLoginPage: "Revenir a la page de connection",
        resetPassword: "Reininialiser mon mot de passe",
        createYourAccount: "Creer votre compte",
        havingAnAccount : "J'ai deja un compte ?",
        orderAgain: "Commander a nouveau",
        contentDeal: "Contenu du menu",
        modify: "Modifier",
        editProfile: "Editer mon compte",
        myOrders: "Mes Commandes",
        purchaseDate: "Date de commande",
        orderNumber: "Nummero de commande",
        orderId: "Identifiant de commande",
        status: "statut",
        myAccount: "Mon compte",
        dashBoard: "Tableau de bord",
        orders: "Commandes",
        warning: "Attention",
        infoMessage: "Information",
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
        priceToPay: "Montant a payer",
        pricePaid: "Montant payé",

        totalNoTax: "Total hors taxes",
        totalTax: "Total taxes",
        totalTTC: "Total TTC",
        deliveryFee: "Frais de livraisons",

        deliverToOtherAddress: "Livrer a une autre adresse",
        validateAdress: "Valider l'adresse",
        clickAndCollect: "A recuperer sur place (Click N Collect)",
        delivery: "Livraison",
        deliveryMode: "Mode de livraison",
        cart: "Panier",
        confirm: "Confirmation",
        order: "Commande",
        categories: "Categories",
        tags: "Tags",
        selectDeal: "Choisir les produits",
        cancel: "Annuler",
        next: "Selectionner le produit suivant",
        select: "Selectionner le produit",
        addMenuToCart: "Ajouter le menu au panier",
        checkOutNow: "Commander",
        continueShopping: "Ajouter d'autres produits",
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
        password: "Mot de passe",
        reTypePassword: "Repeter le mot de passe",
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
        completeAccount: "Completer mon compte",
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
            termsAndConditionsMandatory: "Vous devez accepter les termes et conditions",
            passwordsMatch: 'Les mots de passe doivent être les mêmes',
            reTypePassword: "Fournir le mot de passe une nouvelle fois",
        },

        info: {
            resetPassword: "Un email a été envoyé a {0} pour reinitialiser le mot de passe",
            checkAddessInfo: "Afin de savoir si votre etes eligible à la livraison à domicile, merci de fournir une adresse",
            connectToOrder: 'Afin de garder une trace de vos commandes et de garantir un meilleur suivi, la commande doit se faire en mode connecté. Si vous avez un compte Google ou Facebook <strong>cela ne prendra que quelques secondes !!</strong>'
        },

        warningMessage: {
            maxDistanceDelivery: "L'adresse est en dehors de la zone de livraison mais vous pouvez toujours commander en mode click and collect",
            maxDistanceDeliveryOk: "L'adresse est dans de la zone de livraison",
            selectValidDeliveryAddressAndSchedule: "Selectionner une addresse de livraison valide et un creaneau de reservation",
            optionMandatory: "Merci de choisir les options requisent",
            minimalPriceForDeliveryNoReached: "La livraison n'est disponible que pour un montant minimum de {0} €",
            deliveryUnavailable: "Livraison non disponible",
            profileNotActivated: "Votre compte n'est pas encore actif, vérifier votre email et activer votre compte en cliquant sur le lien contenu dans le mail d'activation, puis connectez-vous de nouveau"
        },

        notif: {
            accountCreated: "Compte cree",
            dealAddedToCart: "Offre ajouté au panier",
            productAddedToCart: "Produit ajouté au panier",
            activationEmailSentNotif: "Email d'activation envoye a {0}, verifier votre email, activez le compte puis connectez-vous de nouveau",
        },

        notifForBackEnd: {
            orderCreated: "Nouvelle Commande en ligne: {0}"
        },

        errorMessages: {
            accountAlreadyExists: "Ce compte est deja referencé, essayer de vous connecter directement en utilisant cet email",
            wrongPassword: "Mot de passe invalide",
            noUserEmail: "Aucun compte trouvé avec cet email"
        },

        emailTemplate: {
            passwordReset: "Cliquer <a href='{0}'>ici</a> pour réinitialiser votre mot de passe {1}",
            activateEmail: "Cliquer <a href='{0}'>ici</a> pour activer votre compte {1}",
            passwordResetSubject: "Réinitialiser votre mot de passe {0}",
            activateEmailSubject: "activer votre compte {0}",
        },

    }
});

export default localStrings;