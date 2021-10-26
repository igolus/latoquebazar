import LocalizedStrings from 'react-localization';
import React from 'react';
import {formatOrderConsumingMode} from "./util/displayUtil";

let localStrings = new LocalizedStrings({
    fr: {
        detail: "Detail",
        productRestricted: "Produit indisponible dans ce contexte",
        cartRestricted: "Produits indisponibles",
        cartRestrictedDetail: "Certains produits deviennent indisponibles dans ce contexte clicker sur detail pour obtenir l'explication",

        close: "Fermer",
        unavailableDay: "Indisponible pour le {0}",
        deliveryUnable: "Indisponible pour le mode {0}",

        deliveryDistanceMin: "La distance jusqu'a l'etablissement doit etre superieure à {0} kms",
        deliveryDistanceMax: "La distance jusqu'a l'etablissement doit etre inférierure à {0} kms",
        deliveryDistanceMinMax: "La distance jusqu'a l'etablissement doit comprise entre {0} et {1} kms",

        priceMin: "Le prix total de la commande doit etre superieure à {0} {1}",
        priceMax: "Le prix total de la commande doit etre inférierure à {0} {1}",
        priceMinMax: "Le prix total de la commande doit etre compris entre {0} et {1} {2}",

        dateMin: "La date de commande doit etre apres le {0}",
        dateMax: "La date de commande doit etre avant le {0}",
        dateMinMax: "La date de commande doit etre  comprise entre le {0} et le {1}",

        hourMin: "L'heure de commande doit etre apres {0}",
        hourMax: "L'heure de commande doit etre avant le {0}",
        hourMinMax: "L'heure de commande doit etre  comprise entre le {0} et le {1}",

        maxItems: "Nombre d'elements maximum atteind",

        restrictionApplies: "Ce produit n'est pas toujours disponible",
        noAvail: "Desolé il n'y a plus de creneaux disponible",
        shareOnFacebook: "Partager ce produit sur facebook",
        back: "Retour",
        poweredBy: "Site construit avec La toque magique",
        phoneInternational: "Numero de telephone au format international +...",
        demoDisclaim: "Ceci est un site de démonstration aucune commande ne sera honorée",
        manageMyAdresses: "Gerer mes adresses",
        updateAddtionalInformation: "Mettre a jour les informations additionnelles",
        defineMainAdress: "Definir mon adresse principale",
        useMyAdresses: "Utiliser mes adresses",
        useCustomAdresses: "Utiliser une autre adresse",

        backToHome: "Revenir a la page d'acceuil",
        backNav: "Revenir en arriere",

        personalInformation: "Saisir vos informations de profil",
        seeInfo: "Voir les infos utiles",
        bookingadditionalInformation: "Information pour la livraison ou demande specifique pour la commande",
        bookingadditionalInformationExample: "Code immeuble, étage, interphone,…",
        closed: "Etablissement exceptionellement fermé",
        new: "Nouveau",
        starProducts: "Top produits",
        mailSent: "Email envoyé",
        mailSentDetail: "Un email avec le detail de votre commande a été envoyé a {0}",
        closingPeriod: "Du {0} au {1}",
        weekDay: "Jour de la semaine",
        closingDays: "Jours de fermeture",
        schedules: "Horaires",
        place: "Notre emplacement",
        openingHours: "Horaires d'ouverture",
        contactUs: "Nous contacter",
        unavailable: "Indisponible",
        modifyMyAccount: "Modifier mon compte",
        homePageTitle: "Accueil",
        infoContactPageTitle: "Informations utiles",
        shopPageTitle: "Voir la carte",
        profilePageTitle: "Mon compte",
        contactInfoPageTitle: "Infos utiles",
        cartPageTitle: "Voir mon panier",

        creditCardDetail: "Detail de carte de credit",
        paymentCreditCard: "Payer par carte bancaire maintenant",
        paymentDelivery: "Payer a la réception",

        paymentMethod: "Methode de payment",
        paymentMethodsForPickup: "Selectionner vos methodes de paiement pour la paiement à la reception",

        saveChange: "Sauvegarder les changements",
        backToProfile: "Retour a mon profil",
        notificationInfo: "Afin de recevoir des notification lorsque votre commande est prète vous pouvez activer les notifications pour ce site, dans la barre de tache de votre navigateur",
        activateNotification: "Activer les notifications",
        home: "Acceuil",
        orderCount: "Commandes",
        awaitingOrders: "Commandes en attente",
        myProfile: "Mon profil",
        seeMyOrderDetail: "Voir le status de ma commande",
        orderCompletedThanks : "Merci d'avoir commandé avec {0}",
        orderCompleted: "Commande confirmée",
        refresh: "Actualiser",
        deliveryEstimateDate: "Date de livraison estimée: {0}",
        orderDate: "Date de commande",
        deliveryHour: "Horaire de livraison prévu",
        pickupHour: "Horaire de récuperation prévu",
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
        orderNumber: "Numero de commande",
        orderNumberMobile: "N°",
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

        //myAdresses: "Mes adresses",

        distanceTime: " distance jusqu'a l'etablissement: {0} km / {1}",
        distanceOnly: " distance jusqu'a l'etablissement: {0} km ",
        timeSlot: "Creneau de reservation",
        selectDeliveryTimeSlot: "Selectionner un creneau de livraison",
        selectPickupTimeSlot: "Selectionner un creneau de recupération",
        priceToPay: "Montant a payer",
        pricePaid: "Montant payé",
        remainingToPay: "Reste a payer: {0}",

        totalNoTax: "Total hors taxes",
        totalCharge: "Total frais",
        totalTax: "Total TVA",
        totalTTC: "Total TTC",
        deliveryFee: "Frais de livraisons",

        deliverToOtherAddress: "Livrer a une autre adresse",
        validateAdress: "Valider l'adresse",
        clickAndCollect: "A recuperer sur place (Click N Collect)",
        clickAndCollectSubTitle: "Récupérez votre commande sans attendre sur votre point de vente",
        delivery: "Livraison",
        deliverySubTitle: "Faites-vous livrer chez vous, au bureau ou encore chez des amis.",
        deliveryMode: "Mode de livraison",
        selectDeliveryMode: "Choississez votre mode de livraison",
        cart: "Panier",
        confirm: "Confirmation",
        confirmAction: "Confirmer",
        order: "Commande",
        categories: "Categories",
        tags: "Tags",
        selectDeal: "Choisir les produits",
        cancel: "Annuler",
        next: "Selectionner le produit suivant",
        select: "Selectionner le produit",
        addMenuToCart: "Ajouter le menu au panier",
        checkOutNow: "Commander",
        checkOutNowAndPayLater: "Commander et payer {0}€ à la reception",
        checkOutNowAndPayCard: "Commander et payer {0}€ maintenant",
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

        myAddresses: "Mes adresses",
        addNewAddress: "Ajouter une nouvelle adresse",
        modifyAddress: "Modifier une adresse",
        modifyMainAddress: "Modifier mon adresse principale",
        mainAddress: "Adresse principale",
        backToAdress: "Retour a mes addresses",
        nameAddress: "Nom de l'adresse",
        updateMainAddress: "Mettre a jour mon adresse principale",
        updateAddress: "Mettre a jour l'adresse",
        createAddress: "Creer l'adresse",


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
        selectDeliveryAdress: "Choisir l'adresse de livraison",
        email: "Email",
        firstName: "Prenom",
        lastName: "Nom",
        termsAndConditions: "Termes et conditions",
        activateAccount: "Activer mon compte",
        completeAccount: "Completer mon compte",
        fillInfoToContinue: "Reseignez les champs pour continuer",
        login: "Se connecter",
        continueWithoutAccount: "Non Merci, Prendre ma commande sans creer de compte",
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

        orderStatus: "Statut de la commande",
        orderStatusNew: "Nouveau",
        orderStatusPreparation: "Prepararation",
        orderStatusReady: "Pret",
        orderStatusDelivering: "En livraison",
        orderStatusComplete: "Finalisé",
        orderStatusFinished: "Terminé",

        paymentMethodsOffline: "Offline payment methods",
        paymentMethodsOnline: "Online payment methods",
        paymentMethodCash: "Espece",
        paymentMethodCC: "Carte",
        paymentMethodCheque: "Cheque",
        paymentMethodTicket: "Ticket restaurant",
        paymentMethodStripe: "Stripe",

        day_1 : "Lundi",
        day_2 : "Mardi",
        day_3 : "Mercredi",
        day_4 : "Jeudi",
        day_5 : "Vendredi",
        day_6 : "Samedi",
        day_7 : "Dimanche",

        lunch: "dejeuner",
        dinner: "dinner",

        hrorderStatusNew: "Nouveau",
        hrorderStatusReceived: "Reçu",
        hrorderStatusAccepted: "Accepté",
        hrorderStatusInPreparation: "En preparation",
        hrorderStatusAwaitingShipment: "Pret a livrer",
        hrorderStatusAwaitingCollection: "Pret a récuperer",
        hrorderStatusinDelivery: "Livraison en cours",
        hrorderStatusCompleted: "Finalisé",
        hrorderStatusRejected: "Rejetée",
        hrorderStatusCancelled: "Annulé",
        hrorderStatusDeliveryFailed: "Echec livraison",

        check: {
            fieldRequired: "Le champ {0} est obligatoire",
            required: "Obligatoire",
            requiredField: "Champ obligatoire",
            badPhoneFormat: "Numero de telephone invalide",
            termsAndConditionsMandatory: "Vous devez accepter les termes et conditions",
            passwordsMatch: 'Les mots de passe doivent être les mêmes',
            reTypePassword: "Fournir le mot de passe une nouvelle fois",
            invalidEmail: "eMail invalide",
            noDaySetting: "Pas de creneaux configurés",

            noSelectPaymentMethod: "Aucune methode de paiments selectionné",
            noSelectSlotMethod: "Aucune Creneau selectionné",
            noDeliveryAdress: "Aucune addresse de livraison selectionné",
            maxDistanceReached: "L'adresse est en dehors de la zone",
            noItemInCart: "Aucun produits dans le panier",

        },

        info: {
            resetPassword: "Un email a été envoyé a {0} pour reinitialiser le mot de passe",
            checkAddessInfo: "Afin de savoir si votre etes eligible à la livraison à domicile, merci de fournir une adresse",
            connectToOrder: "Afin de garder une trace de vos commandes et de garantir un meilleur suivi, nous vous conseillons d'effectuer la commande en mode connecté. Si vous avez un compte Google <strong>cela ne prendra que quelques secondes !!</strong>",
        },

        warningMessage: {
            noMainAddDefined: "Votre adresse principale n'est pas definie",
            maxDistanceDelivery: "L'adresse est en dehors de la zone de livraison mais vous pouvez toujours commander en mode click and collect",
            maxDistanceDeliveryOk: "L'adresse est dans de la zone de livraison",
            selectValidDeliveryAddressAndSchedule: "Selectionner une addresse de livraison valide et un creaneau de reservation",
            optionMandatory: "Merci de choisir les options requises",
            minimalPriceForDeliveryNoReached: "La livraison n'est disponible que pour un montant minimum de {0} €",
            deliveryUnavailable: "Livraison non disponible",
            paymentIssue: "Un probleme est servenu avec votre payment",
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

        confirmMessage: {
            deleteAddress: 'Etes vous sur de vouloir supprimer cette addresse ?',
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