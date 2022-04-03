import LocalizedStrings from 'react-localization';
import React from 'react';

let localStrings = new LocalizedStrings({
    fr: {
        pendingPointsGain: "Vous gagnez {0} points avec cette commande",
        use: "Utiliser",
        useYouPoints: "Utilisez vos points",
        useYouPointsDetail: "Vous possedez {0} points de fidelité (={1}). Vous pouvez utiliser vos points et économiser <strong>{1}</strong> avec cette commande",

        loyalty: "Fidelité",
        bravo: "Bravo",
        loyaltyPoints: "Mes points de fidelités",
        loyaltyPointsEarned: "Felicitation Vous avez cumulé {0} points de fidelités",
        loyaltyPointsSpent: "Vous avez depensé {0} points de fidelités",
        loyaltyPointNumber: "{0} points",
        loyaltyRemainsToSpent: "Plus que {0} points pour pouvoir en profiter !!",
        loyaltyCanUsuPoints: "Vous points sont utilisables !!!",
        useLoyaltyPoints: "Utiliser {0} points et economiser {1}",
        usedLoyaltyPoints: "Vous Economisez {0} avec vos {1} points de fidelités (Les prix rééls appliqué peuvent variés de quelques centimes)",
        discountsLoyaltyName: "-{0} avec vos {1} points de fidelités",

        discountPointRemoved: "Promotion desactivé",
        discountPointRemovedDetail: "Votre promotion a été desactivée car le montant de votre panier a changé. Vous pouvez toujours réappliquer votre promotion sur votre nouveau panier",

        myMainInfo: "Mes informations principales",
        myRequirements: "Mes exigences",
        myOptions: "Mes options",
        leaveCommentOnGoogle: "Laissez nous un commentaire sur google",
        ownerResponse: "Response du propriétaire",
        update: "Mettre a jour",
        deleteReview: "Supprimmer cet avis",
        editReview: "Editer cet avis",
        writeReviewHere: "Ecrire votre avis ici",
        yourReview: "Votre avis sur le produit",
        yourRating: "Votre note",
        postReview: "Poster le l'avis",
        writeReview: "Donnez votre avis sur ce produit",
        writeReviewFirst: "Soyez le premier a donnez votre avis sur ce produit",
        updateReview: "Mettez a jour votre avis sur ce produit",
        reviews: "Avis",
        thisIspresent: "Offert",
        noThanks: "Non merci",
        priceWithOffer: "Prix avec l'offre: {0}",
        saveWithOffer: "Economie avec l'offre:-{0}%",
        specialOffer: "Profitez de l'offre \"{0}\" pour seulement  {1} de plus et économisez sur les produits suivants",
        specialOfferNoSavePrice: "Profitez de l'offre \"{0}\" et économisez sur les produits suivants",
        dealApplied: "offre appliquée",
        dealAppliedDetail: "L'offre spéciale {0} a été appliqué à votre panier vous économisez {1} Eur",
        noAllergens: "Ce produit ne contient aucun allergène alimentaire majeur",
        allergensList: "Liste des allergènes majeurs contenus dans ce produit:",
        seeDetail: "Voir le detail",
        deliveryHourAndPlace: "Horaires d'ouverture et emplacement",
        deliveryHourAndPlaceDesc: "Consultez nos horaires d'ouverture et notre emplacement",


        mobileCategory: "Catégories",
        noAdresseFound: "Continuer a saisir du texte pour trouver votre adresse...",
        fillAddressDelivery: "Saisir ici une adresse de livraison",
        //fillAddressDeliveryConnectedIf: "Ou saisir ici une adresse de livraison personalisée",
        fillAddressDeliveryConnected: "Ou saisir ici votre adresse de livraison",

        fillAddress: "Saisir ici votre adresse",
        fillAddressName: "Saisir ici le nom de votre adresse (Travail, Maison, ...)",

        couponNotValidAnymore: "Votre coupon {0} n'est plus disponible et a été supprimé",
        couponNotValidAnymoreTitle: "Coupon invalide",

        invalidCouponConsumed: "Vous avez déjà consommé ce coupon !",
        invalidCouponBadEsta: "Ce coupon n'est pas valide pour l'etablissement selectioné !",
        invalidCouponTooSoon: "Ce coupon n'est pas encore valide !",
        invalidCouponTooLate: "Ce coupon n'est plus valide !",
        invalidCouponPrice: "Votre panier n'atteinds pas la somme minimale requise de {0} {1}",
        couponAlreadyInUse: "Un coupon est déja en cours d'utilisation",
        wrongCouponCode: "Le code {0} n'est pas valide",
        codeApplied: "Code {0} appliqué",
        applyCouponCode: "Appliquer mon code",
        connectApplyCouponCode: "Connectez-vous pour appliquer votre code",
        cannotApplyCouponCodeWithLoyalty: "Imcompatible avec les points de fidelités",
        connectWriteComment: "Connectez-vous pour laisser votre avis",
        IHaveACouponCode: "J'ai un code promo",
        IUnderstand: "J'ai compris",
        setClosestEsta: "Sélectionnez l'établissement le plus proche",
        selectEsta: "Sélectionnez votre établissement",
        changeEsta: "Changer d'etablissement",
        selectedEsta: "Etablissement selectionné",
        cgvAccept: "J'accepte les termes et conditions",
        commercialAgreementAccept: "J'accepte de recevoir des proposition commerciales par email",
        seeCgvAccept: "Voir les termes et conditions",
        legalNotice: "Mentions légales",
        cgv: "Conditions générales de vente",
        unavailableInDelivery: "Indisponible en livraison",
        allCat: "toutes categories",
        categoryTitleDef: "{0} categorie {1}",
        categoryDescriptionDef: "{0} vous propose les produits de la catégorie {1}",
        siteUnavailable: "Le site n'est pas disponible",
        siteUnavailableDetail: "Contactez le restaurant pour plus d'information",

        loginError: "Erreur d'authentification",
        detail: "Detail",
        productRestricted: "Produit indisponible dans ce contexte",
        cartRestricted: "Produits indisponibles",
        cartRestrictedDetail: "Certains produits deviennent indisponibles dans ce contexte cliquez sur detail pour obtenir l'explication",

        close: "Fermer",
        unavailableDay: "Indisponible pour le {0}",
        deliveryUnable: "Indisponible pour {0}",
        bookingTimeUnable: "Indisponible pour pour le moment",
        deliveryZone: "Indisponible dans cette zone de livraison",
        bookingSameDay: "La date de commande et la date de retrait/livraison doivent être égales",

        deliveryDistanceMin: "La distance jusqu'à l'établissement doit être supérieure à {0} kms",
        deliveryDistanceMax: "La distance jusqu'à l'établissement doit être inférieure à {0} kms",
        deliveryDistanceMinMax: "La distance jusqu'à l'établissement doit comprise entre {0} et {1} kms",

        priceMin: "Le prix total de la commande doit être supérieure à {0} {1}",
        priceMax: "Le prix total de la commande doit être inférieure à {0} {1}",
        priceMinMax: "Le prix total de la commande doit être compris entre {0} et {1} {2}",

        dateMin: "La date de commande doit être apres le {0}",
        dateMax: "La date de commande doit être avant le {0}",
        dateMinMax: "La date de commande doit être  comprise entre le {0} et le {1}",

        hourMin: "L'heure de commande doit être apres {0}",
        hourMax: "L'heure de commande doit être avant le {0}",
        hourMinMax: "L'heure de commande doit être  comprise entre le {0} et le {1}",

        maxItems: "Nombre d'elements maximum atteind",

        restrictionApplies: "Ce produit n'est pas toujours disponible",
        noAvail: "Désolé il n'y a plus de créneau disponible, essayez à un autre moment",
        shareOnFacebook: "Partager ce produit sur facebook",
        back: "Retour",
        poweredBy: "Site construit avec La toque magique",
        phoneInternational: "Numéro de téléphone au format international +...",
        demoDisclaim: "Ceci est un site de démonstration aucune commande ne sera honorée",
        manageMyAdresses: "Gérer mes adresses",
        updateAddtionalInformation: "Mettre à jour les informations additionnelles",
        updateCustomerDeliveryInformation: "Mettre à jour les informations de livraison de cette adresse",
        defineMainAdress: "Définir mon adresse principale",
        useMyAdresses: "Utiliser mes adresses",
        useCustomAdresses: "Utiliser une autre adresse",

        backToHome: "Revenir à la page d'accueil",
        backNav: "Revenir en arriere",

        personalInformation: "Saisir vos informations de commandes",
        seeInfo: "Voir les infos utiles",
        bookingadditionalInformationNotes: "Note pour la commande",
        bookingadditionalInformationNotesPlaceHolder: 'Indiquez par exemple "Viande bien cuite" ou "Sans mayonnaise", ...',
        bookingadditionalInformation: "Information pour la livraison ou demande spécifique pour la commande",

        bookingadditionalInformationExample: "Code immeuble, étage, interphone,…",
        closed: "Etablissement exceptionellement fermé",
        new: "Nouveau",
        starProducts: "Top produits",
        mailSent: "Email envoyé",
        mailSentDetail: "Un email avec le detail de votre commande a été envoyé à {0}",
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
        shopPageTitle: "Commander",
        profilePageTitle: "Mon compte",
        contactInfoPageTitle: "Infos utiles",
        openingAndLocation: "Emplacements et horaires",
        cartPageTitle: "Voir mon panier",

        creditCardDetail: "Detail de carte de credit",
        paymentCreditCard: "Payer par carte bancaire maintenant",
        paymentDelivery: "Payer à la réception",

        paymentMethod: "Méthode de paiement",
        paymentMethodsForPickup: "Sélectionnez vos méthodes de paiement pour le paiement à la réception",

        saveChange: "Sauvegarder les changements",
        backToProfile: "Retour à mon profil",
        notificationInfo: "Afin de recevoir des notifications lorsque votre commande est prête vous pouvez activer les notifications pour ce site, dans la barre de tâche de votre navigateur",
        activateNotification: "Activer les notifications",
        home: "Accueil",
        orderCount: "Commandes",
        awaitingOrders: "Commandes en attente",
        myProfile: "Mon profile",
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
        mandatorySelection: "(Sélection obligatoire)",

        optionListWithLimitMinMax: "Option {0} sélectionnez minimum {1} option(s) et maximum {2} {3}",
        optionListWithLimitMin: "Option {0} sélectionnez minimum {1} option(s) {2}",
        optionListWithLimitMax: "Option {0} sélectionnez maximum {1} option(s) {2}",
        optionListWithLimit: "Option {0} {1}",

        mandatoryOption: "(obligatoire)",
        sendLinkAgain: "Ré-envoyer le lien d'activation",
        backToLoginPage: "Revenir a la page de connection",
        resetPassword: "Reininialiser mon mot de passe",
        createYourAccount: "Créer mon compte",
        havingAnAccount : "J'ai déjà un compte ?",
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
        viewAllCat: "Voir toutes les catégories",
        backToCart: "Revenir au panier",

        phone: "Téléphone",
        bookWithoutAccount: "Commander sans creer de compte",
        profileInformation: "Information de compte",
        tooFarAddress: "Adresse en dehors de la zone de livraison",
        formatDuration: "HH [heure(s) et] mm [minute(s)]",
        formatDurationNoHour: "mm [minute(s)]",

        //myAdresses: "Mes adresses",

        distanceTime: " distance jusqu'à l'établissement: {0} km / {1}",
        distanceOnly: " distance jusqu'à l'établissement: {0} km ",
        timeSlot: "Créneau de réservation",
        pickupSlot: "Créneau de récupération",
        selectDeliveryTimeSlot: "Sélectionner un créneau de livraison",
        selectPickupTimeSlot: "Sélectionner un créneau de récupération",
        priceToPay: "Montant à payer",
        pricePaid: "Montant payé",
        remainingToPay: "Reste a payer: {0}",

        totalNoTax: "Total hors taxes",
        totalCharge: "Total frais",
        totalTax: "Total TVA",
        savedCode: "Économie avec la promo: {0}",
        couponCode: "code promo: {0}",
        couponCodeSingle: "code promo",
        pointsSave: "{0} points",

        totalTTC: "Total TTC",
        deliveryFee: "Frais de livraisons",
        totalFee: "Total frais",

        deliverToOtherAddress: "Livrer a une autre adresse",
        validateAdress: "Valider l'adresse",
        clickAndCollect: "A récupérer sur place (Click N Collect)",
        clickAndCollectSubTitle: "Récupérez votre commande sans attendre sur votre point de vente",
        delivery: "Livraison",
        deliverySubTitle: "Faites-vous livrer chez vous, au bureau ou encore chez des amis.",
        deliveryMode: "Mode de livraison",
        selectDeliveryMode: "Choississez votre mode de livraison",
        cart: "Panier",
        cartDesc: "Contenu de votre panier",
        confirm: "Confirmation",
        confirmAction: "Confirmer",
        order: "Commande",
        categories: "Catégories",
        tags: "Tags",
        selectDeal: "Choisir les produits",
        choose: "Choisir",
        cancel: "Annuler",
        next: "Selectionner le produit suivant",
        select: "Selectionner le produit",
        addMenuToCart: "Ajouter le menu au panier",
        checkOutNow: "Commander",
        checkOutNowAndPayLater: "Commander et payer {0}€ à la réception",
        checkOutNowAndPayCard: "Commander et payer {0}€ maintenant",
        orderFree: "Commander gratuitement !!",
        continueShopping: "Ajouter d'autres produits",
        viewCart: "Voir le detail du panier",
        emptyBasket: "Votre panier est vide",
        cartItemNumber: "{0} produits dans le panier",
        selectOptions: "Choisir les options",
        deals: "Menu et offres",
        sortBy: "Trier par ",
        ourProducts: "Nos produits",
        view: "Vue",
        allCategories: "Toutes les catégories",
        category: "Catégorie",
        categorie: "Categories",
        searchResults: 'Résultats de recherche pour: "{0}"',
        searchFor: "Rechercher un produit ....",
        continueWithGoogle: "Identification avec google",
        continueWithFaceook: "Continuer avec facebook",
        profile: "Profile",
        profileDesc: "Information de votre Profil",
        myAccount: "Mon compte",
        myOrders: "Mes commandes",

        myAddresses: "Mes adresses",
        addNewAddress: "Ajouter une nouvelle adresse",
        modifyAddress: "Modifier une adresse",
        modifyMainAddress: "Modifier mon adresse principale",
        mainAddress: "Adresse principale",
        backToAdress: "Retour à mes adresses",
        nameAddress: "Nom de l'adresse",
        updateMainAddress: "Mettre à jour mon adresse principale",
        updateAddress: "Mettre à jour l'adresse",
        createAddress: "Créer l'adresse",


        account: "Compte",
        logout: "Se déconnecter",
        password: "Mot de passe",
        reTypePassword: "Repeter le mot de passe",
        logEmailAndPassword: "Identifiez vous",
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
        completeAccount: "Compléter mon compte",
        fillInfoToContinue: "Renseignez les champs pour continuer",
        login: "Se connecter",
        continueWithoutAccount: "Non Merci, Prendre ma commande sans créer de compte",
        bySigningTermsAndConditions: "En cochant cette case vous acceptez les termes et conditions",
        requiredField: "Le champ {0} est obligatoire",
        addToCart: "Ajouter au panier",
        description: "Description",
        additionalInformation: "Information additionnelle",
        customerDeliveryInformation: "Information additionnelle pour la livraison",
        customerDeliveryInformationPlaceHolder: 'Indiquer ici par exemple votre code porte, ou d\'autres indications pour le livreur',
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
        paymentMethodCash: "Espèce",
        paymentMethodCC: "Carte",
        paymentMethodCheque: "Chèque",
        paymentMethodTicket: "Ticket restaurant",
        paymentMethodStripe: "Stripe",

        day_0 : "Lundi",
        day_1 : "Mardi",
        day_2 : "Mercredi",
        day_3 : "Jeudi",
        day_4 : "Vendredi",
        day_5 : "Samedi",
        day_6 : "Dimanche",

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
            badPhoneFormat: "Numéro de téléphone invalide",
            termsAndConditionsMandatory: "Vous devez accepter les termes et conditions",
            passwordsMatch: 'Les mots de passe doivent être les mêmes',
            reTypePassword: "Fournir le mot de passe une nouvelle fois",
            invalidEmail: "eMail invalide",
            noDaySetting: "Pas de créneau configuré",

            noSelectPaymentMethod: "Aucune méthode de paiments selectionné",
            noSelectSlotMethod: "Aucune Créneau selectionné",
            noDeliveryAdress: "Aucune adresse de livraison selectionné",
            maxDistanceReached: "L'adresse est en dehors de la zone",
            noItemInCart: "Aucun produits dans le panier",
            badContactInfo: "Information de contact invalides",
            pleaseAcceptCgv: "Merci d'accepter les termes et conditions",
        },

        info: {
            resetPassword: "Un email a été envoyé a {0} pour réinitialiser le mot de passe",
            checkAddessInfo: "Afin de savoir si votre etes eligible à la livraison à domicile, merci de fournir une adresse",
            connectToOrder: "Afin de garder une trace de vos commandes et de garantir un meilleur suivi, nous vous conseillons d'effectuer la commande en mode connecté. Si vous avez un compte Google, Cela ne prendra que quelques secondes !!",
        },

        warningMessage: {
            noMainAddDefined: "Votre adresse principale n'est pas définie",
            maxDistanceDelivery: "L'adresse sélectionnée est en dehors de la zone de livraison mais vous pouvez toujours commander en mode click and collect",
            maxDistanceDeliveryOk: "L'adresse sélectionnée est dans la zone de livraison",
            selectValidDeliveryAddressAndSchedule: "Sélectionner une adresse de livraison valide et un créneau de réservation",
            optionMandatory: "Merci de choisir les options requises",
            minimalPriceForDeliveryNoReached: "La livraison n'est disponible que pour un montant minimum de {0} €",
            deliveryUnavailable: "Livraison non disponible",
            paymentIssue: "Un problème est survenu avec votre paiement",
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
            accountAlreadyExists: "Ce compte est déjà référencé, essayer de vous connecter directement en utilisant cet email",
            wrongPassword: "Mot de passe invalide",
            noUserEmail: "Aucun compte trouvé avec cet email"
        },

        confirmMessage: {
            deleteAddress: 'Etes-vous sûr de vouloir supprimer cette adresse ?',
            deleteReview: 'Etes-vous sûr de vouloir supprimer cet avis ?',
        },

        emailTemplate: {
            passwordReset: "Cliquer <a href='{0}'>ici</a> pour réinitialiser votre mot de passe {1}",
            activateEmail: "Cliquer <a href='{0}'>ici</a> pour activer votre compte {1}",
            passwordResetSubject: "Réinitialiser votre mot de passe {0}",
            activateEmailSubject: "Activer votre compte {0}",
        },
        allergens: "Allergènes",
        allergenTypes: {
            gluten: "Gluten",
            shellfish: "Crustacés",
            egg: "Oeuf",
            fishes: "Poissons",
            peanuts: "Arachides",
            soy: "Soja",
            milk: "Lait",
            nuts: "Fruits à coques",
            celery: "Celeri",
            mustard: "Moutarde",
            sesameSeeds: "Graines de sésame",
            sulfurDioxideSulphites: "Anhydride sulfureux et sulfites",
            lupine: "Lupin",
            molluscs: "Mollusques"
        },


    }
});

export default localStrings;