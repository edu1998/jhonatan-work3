export const sellerMarketplaces = {
    AMAZON: 'Amazon',
    AMAZON_MX: 'Amazon Mexico',
    AMAZON_CA: 'Amazon Canada',
    AMAZON_BR: 'Amazon Brazil',
    EBAY: 'Ebay',
    EBAY_CA: 'Ebay Canada',
    EBAY_ES: 'Ebay Spain',
    EBAY_DE: 'Ebay Germany',
    WALMART: 'Walmart',
    SHOPIFY: 'Shopify'
};
export const marketplaceCurrency = {
    'Amazon': 'USD',
    'Amazon Mexico': 'MXN',
    'Amazon Canada': 'CAD',
    'Amazon Brazil': 'BRL',
    'Ebay': 'USD',
    'Ebay Canada': 'CAD',
    'Ebay Spain': 'EUR',
    'Ebay Germany': 'EUR',
    'Walmart': 'USD',
    'Shopify': 'USD',
};

export const sellerMarketplacesList = [
    { name: sellerMarketplaces.AMAZON },
    { name: sellerMarketplaces.WALMART },
    { name: sellerMarketplaces.EBAY },
    { name: sellerMarketplaces.SHOPIFY }
];

export const ListingStateEnum = {
    PENDING: 'Pendiente',
    PENDING_CLIENT: 'Pendiente Cliente',
    PENDING_LAP: 'Pendiente LAP',
    PENDING_ACKNOWLEDGE: 'Pendiente aceptación',
    COMPLETED: 'Completado',
    SHIPPING: 'En tránsito',
    PUBLISHED: 'Publicado',
    SENT: 'Enviado',
}

export const initialMyAccountData = {
    name: null,
    vat: null,
    industry_id: null,
    street: null,
    zip: null,
    email: null,
    bank_ids: null,
    acc_number: null,
    company_id: null,
    phone: null,
    passport_id: null,
    birthday: null,
    country_id: null,
    x_fantasy_name: null,
    x_employees_number: null,
    x_sales_range: null,
    x_project_name: null,
}

export const initialMyBankAccountData = {
    bank: null,
    acc_number: null
}

export const initialMySellerAccountAmazon = undefined
export const initialMySellerAccountEbay = {
    // x_aws_id: null,
    // x_aws_id_acc_key: null,
    // x_aws_id_acc_sec: null,
    x_client_id: null,
    x_acc_key: null,
    x_acc_secret: null,
    x_seller_marketplace: sellerMarketplaces.EBAY, // para los mercados amazon, ebay, walmart,
    x_seller_lap: false,
}
export const initialMySellerAccountWalmart = {
    // x_aws_id: null,
    // x_aws_id_acc_key: null,
    // x_aws_id_acc_sec: null,
    x_client_id: null,
    x_acc_key: null,
    x_acc_secret: null,
    x_seller_marketplace: sellerMarketplaces.WALMART, // para los mercados amazon, ebay, walmart,
    x_seller_lap: false,
}

export const initialOrder = {
    ref: null,
    hasVariant: false,
    category: null,
    title: 'A product added by me',
    bulletPoint1: null,
    bulletPoint2: null,
    bulletPoint3: null,
    bulletPoint4: null,
    bulletPoint5: null,
    description: null,
    weight: null,
    refPrice: 123,
    sku: 'FAU570',
    code_ean_upc: null,
    pack: null,
    marketplaces: ['Amazon', 'Walmart'],
    commentsLAP: 'HELLO THERE!',
    competitorsFileURL: null,
    variants: []
}

export const initialImages = {
    video: null,
    mainPhoto: [],
    productPhoto: [],
    productPhotoInUse: [],
    productPhotoMoreDetails: [],
}

export const initialProductVariant = {
    id: null,
    title: null,
    brand: null,
    bulletPoint1: null,
    bulletPoint2: null,
    bulletPoint3: null,
    bulletPoint4: null,
    bulletPoint5: null,
    description: null,
    components: null,
    weight: null,
    refPrice: null,
    sku: null,
    code_ean_upc: null,
    pack: null,
    variants: []
}

export const validateMessages = {
    required: '${label} es requerido!',
    types: {
        email: '${label} no tiene un formato válido!',
        number: '${label} no es un número válido!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

export const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'YYYY-MM-DD'];
export const maxLength13 = 13;
export const maxLength200 = 200;
export const maxLength500 = 500;
export const maxLength2000 = 2000;

export const URL_SP_AWS = 'https://lapmarketplace.com/files/Instructivo%20Creaci%C3%B3n%20de%20Cuenta%20en%20Amazon%20-%20LAP.pdf';
export const URL_CALENDLY = 'https://assets.calendly.com/assets/external/widget.js';
export const USER_CALENDLY = 'onboarding-lap';
export const EVENT_SP_CALENDLY = '30min';
export const EVENT_WELCOME_CALENDLY = 'lap-welcome';

export const marketplaces = [
    { country: 'Canada', marketplaceId: 'A2EUQ1WTGCTBG2', countryCode: 'CA' },
    { country: 'United States of America', marketplaceId: 'ATVPDKIKX0DER', countryCode: 'US' },
    { country: 'Mexico', marketplaceId: 'A1AM78C64UM0Y8', countryCode: 'MX' },
    { country: 'Brazil', marketplaceId: 'A2Q3Y263D00KWC', countryCode: 'BR' },
    { country: 'Spain', marketplaceId: 'A1RKKUPIHCS9HS', countryCode: 'ES' },
    { country: 'United Kingdom', marketplaceId: 'A1F83G8C2ARO7P', countryCode: 'GB' },
    { country: 'France', marketplaceId: 'A13V1IB3VIYZZH', countryCode: 'FR' },
    { country: 'Netherlands', marketplaceId: 'A1805IZSGTT6HS', countryCode: 'NL' },
    { country: 'Germany', marketplaceId: 'A1PA6795UKMFR9', countryCode: 'DE' },
    { country: 'Italy', marketplaceId: 'APJ6JRA9NG5V4', countryCode: 'IT' },
    { country: 'Sweden', marketplaceId: 'A2NODRKZP88ZB9', countryCode: 'SE' },
    { country: 'Turkey', marketplaceId: 'A33AVAJ2PDY3EV', countryCode: 'BR' },
    { country: 'United Arab Emirates', marketplaceId: 'A2VIGQ35RCS4UG', countryCode: 'AE' },
    { country: 'India', marketplaceId: 'A21TJRUUN4KGV', countryCode: 'IN' },
    { country: 'Singapore', marketplaceId: 'A19VAU5U5O7RUS', countryCode: 'SG' },
    { country: 'Australia', marketplaceId: 'A39IBJ37TRP1C6', countryCode: 'AU' },
    { country: 'Japan', marketplaceId: 'A21TJRUUN4KGV', countryCode: 'JP' },
]

export const documentTypes = { video: 'video', text: 'documento', image: 'imagen', competitors: 'competitors', order: 'order' };

export const validSizesImagesForMarkets = {
    AmazonMinimumSize: 2000,
    AmazonMaximumSize: 10000,
    AmazonMaximumWeight: 7,
    EbayMinimumSize: 500,
    EbayMaximumSize: 10000,
    EbayMaximumWeight: 7, // 7 MB -> 1024 bytes * 1024 kb = 1 MB
    WalmartMinimumSize: 500,
    WalmartMaximumSize: 2,
    WalmartMaximumWeight: 1,
};
export const validFormatsImagesForMarkets = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff']
export const descriptionImagesForMarkets = {
    Amazon: '<ul>' +
        '<span>Requisitos de Formato para fotografías en Amazon</span>' +
        '<li>Las imágenes tienen que representar fielmente el producto que está a la venta y que recibirá el cliente (sin accesorio)</li>' +
        '<li>El producto debe ocupar como mínimo el 85% del área de la imagen.</li>' +
        '<li>Deben tener los formatos JPEG (.jpg o.jpeg), TIFF (.tif), PNG (.png) o GIF (.gif). Se prefiere el formato JPEG.</li>' +
        '<li>No deben estar borrosas o pixeladas, ni tener bordes irregulares. Resolución mínima 150 pp (puntos por pixel)</li>' +
        '<li>Las imágenes principales deben tener un fondo blanco puro,  con un valor RGB de 255, 255, 255.</li>' +
        '<li>Relación de aspecto 1:1 (cuadradas)</li>' +
        '<li>La función de zoom óptima requiere un tamaño mínimo de 2000px x 2000px (pixeles).</li>' +
        '</ul>',
    Ebay: '<ul>' +
        '<li>Coloca el artículo contra un fondo liso blanco o de otro color neutro; si vas a hacer una foto de un artículo brillante o reflectante, como una pieza de joyería, es posible que un fondo negro funcione mejor.</li>' +
        '<li>Utiliza un trípode para que la cámara permanezca estable y pueda tomar fotos claras y nítidas. Si no tienes un trípode, coloca la cámara sobre una superficie plana y utiliza el temporizador del obturador para eliminar el exceso de movimiento.</li>' +
        '<li>No uses flash, ya que puede causar la aparición de sombras, reflejos, manchas y zonas grises en la imagen.</li>' +
        '<li>Las fotos deben tener como mínimo 500 píxeles en el lado más largo, pero te recomendamos que procures que tengan entre 800 y 1600 píxeles en el lado más largo. La Herramienta de envío de imágenes de eBay admite imágenes de un tamaño máximo de 7 MB.</li>' +
        '<li>Toma imágenes de las partes superior, inferior y laterales del artículo, con primeros planos detallados. Además, incluye fotos que muestren claramente cualquier defecto, arañazo u otras imperfecciones.</li>' +
        '<li>El formato de las imágenes tiene que ser JPEG (.jpg), TIFF (.tif) o PNG (.png). Se prefiere el formato JPEG.</li>' +
        '<li>No superpongas texto como "envío gratis" ni logotipos del vendedor. La información de ese tipo debe incluirse en el título, el subtítulo o la descripción del artículo.</li>' +
        '<li> Si el artículo que vas a poner en venta es un artículo usado, no puedes utilizar una foto genérica ni de catálogo.</li>' +
        '</ul>',
    Walmart: '<ul>' +
        '<li>Recomendaciones de tamaño y formato de imagen: JPEG, JPG, PNG.</li>' +
        '<li>Tamaño máximo del archivo: 1 MB.</li>' +
        '<li>Resolución de imagen recomendada: 2000 x 2000 píxeles a 300 ppp.</li>' +
        '<li>Resolución de imagen recomendada: 1000 x 1000 píxeles a 72 ppp.</li>' +
        '<li>Requisitos mínimos de resolución de imagen: .</li>' +
        '<ul><li>Para capacidad de zoom : 2000 x 2000 píxeles a 300 ppp.</li>' +
        '<li>Sin capacidad de zoom : 500 x 500 píxeles a 72 ppp.</li>' +
        '<li>Nota : No agrande una imagen de baja resolución para cumplir con estos requisitos, ya que disminuirá la calidad de su imagen. **</li></ul>' +
        '<li>Requisitos de URL de imagen: Las URL de imagen deben terminar en un tipo de archivo de imagen (como .jpg, .png, etc.) y deben vincularse a un archivo de imagen público que se carga como una imagen, no como una página HTML.</li>' +
        '<li>El formato de las imágenes tiene que ser JPEG (.jpg), TIFF (.tif) o PNG (.png). Se prefiere el formato JPEG.</li>' +
        '<li>Utiliza un fondo de color blanco puro (valores RGB 255,255,255).</li>' +
        '<li>Para la imagen principal, elija una imagen clara y fácilmente reconocible que resalte las características principales del elemento en una sola toma. En general, nos gustaría que las imágenes del artículo principal se fotografiaran en un ángulo similar (mirando ligeramente a la derecha, lejos de la taxonomía), lo que nos ayuda a mostrar la mejor vista posible del artículo y mantiene nuestras páginas consistentes.</li>' +
        '<li>No superpongas texto como "envío gratis" ni logotipos del vendedor. La información de ese tipo debe incluirse en el título, el subtítulo o la descripción del artículo.</li>' +
        '<li>Vistas prohibidas : no se pueden mostrar marcas de agua, lenguaje publicitario, superposiciones de texto, cupones o bordes en las imágenes.</li>' +
        '<li>Vista de variante sugerida : imagen principal que muestra la variante actual (especialmente si la variante es un color).</li>' +
        '</ul>',
    Shopify: '<ul>' +
        '<li>Recomendaciones de tamaño y formato de imagen: JPEG, JPG, PNG.</li>' +
        '<li>Tamaño máximo del archivo: 20 MB.</li>' +
        '<li>Resolución máxima de imagen: 4472 x 4472 píxeles.</li>' +
        '<li>Resolución de imagen recomendada: 2048 x 2048 píxeles.</li>' +
        '<li>Requisitos mínimos de resolución de imagen: .</li>' +
        '<ul><li>Para capacidad de zoom : 800 x 800 píxeles a 300 ppp.</li>' +
        '<li>Sin capacidad de zoom : 500 x 500 píxeles a 72 ppp.</li>' +
        '<li>Nota : No agrande una imagen de baja resolución para cumplir con estos requisitos, ya que disminuirá la calidad de su imagen. **</li></ul>' +
        '<li>Requisitos de URL de imagen: Las URL de imagen deben terminar en un tipo de archivo de imagen (como .jpg, .png, etc.) y deben vincularse a un archivo de imagen público que se carga como una imagen, no como una página HTML.</li>' +
        '<li>El formato de las imágenes tiene que ser JPEG (.jpg), TIFF (.tif) o PNG (.png). Se prefiere el formato JPEG.</li>' +
        '<li>Utiliza un fondo de color blanco puro (valores RGB 255,255,255).</li>' +
        '<li>Para la imagen principal, elija una imagen clara y fácilmente reconocible que resalte las características principales del elemento en una sola toma. En general, nos gustaría que las imágenes del artículo principal se fotografiaran en un ángulo similar (mirando ligeramente a la derecha, lejos de la taxonomía), lo que nos ayuda a mostrar la mejor vista posible del artículo y mantiene nuestras páginas consistentes.</li>' +
        '<li>No superpongas texto como "envío gratis" ni logotipos del vendedor. La información de ese tipo debe incluirse en el título, el subtítulo o la descripción del artículo.</li>' +
        '<li>Vistas prohibidas : no se pueden mostrar marcas de agua, lenguaje publicitario, superposiciones de texto, cupones o bordes en las imágenes.</li>' +
        '<li>Vista de variante sugerida : imagen principal que muestra la variante actual (especialmente si la variante es un color).</li>' +
        '</ul>'
}

export const listingSteps = { PRICE: 'Price', ORDER: 'Order', MEASURES: 'Measures', IMAGES: 'Images', DRAFT: 'Draft' };
export const listingStates = { PENDING: 'Pendiente', PENDING_CLIENT: 'Pendiente Cliente', PENDING_LAP: 'Pendiente LAP', PENDING_ACKNOWLEDGE: 'Pendiente aceptación', COMPLETED: 'Completado', SHIPPING: 'En tránsito', PUBLISHED: 'Publicado', SENT: 'Enviado' };
export const orderSteps = { CONTENIDO: 'Contenido', CAJAS: 'Cajas', ESTADO: 'Estado' };
export const orderStates = { PENDING: 'Pendiente', PENDING_CLIENT: 'Pendiente Cliente', PENDING_LAP: 'Pendiente LAP', PENDING_ACKNOWLEDGE: 'Pendiente aceptación', COMPLETED: 'Completado' };
export const orderGeneralStates = { PLAN_CREATED: 'Plan creado', SHIPMENT_CREATED: 'Envío creado', DRAFT: 'Borrador', CONFIRMED: 'Confirmada', CANCELLED: 'Cancelada', SHIPPED: 'Enviada', ARRIVED_OK: 'Recibida OK', ARRIVED_ERROR: 'Recibida ERROR' };
export const noteTypes = { NOTE: 'Note', CREATE_ORDER: 'Create order', STATE_CHANGE: 'State change', SENT_PROPOSAL: 'Sent proposal', ACCEPTED_PROPOSAL: 'Accepted proposal', REJECTED_PROPOSAL: 'Rejected proposal', GO_BACK: 'Go back' };
export const shippingTypes = { AVION: 'Avión', BARCO: 'Barco' };
export const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

/* STEP IMAGES - ONBOARDING **/
export const imageSectionEnum = {
    CATEGORY: 'productCategoryPhoto',
    MAIN: 'mainPhoto',
    PRODUCT: 'productPhoto',
    IN_USE: 'productPhotoInUse',
    MORE_DETAILS: 'productPhotoMoreDetails',
};

/* Order Sales - HOME - */
export const orderSaleStates = {
    PAID: "Paid",
    PENDING: "Pending",
    UNSHIPPED: "Unshipped",
    PARTIALLY_SHIPPED: "PartiallyShipped",
    SHIPPED: "Shipped",
    CANCELED: "Canceled",
    UNFULFILLABLE: 'Unfulfillable',
    INVOICE_UNCONFIRMED: 'InvoiceUnconfirmed',
    PENDING_AVAILABILITY: 'PendingAvailability',
    REFUND: 'Refund',
    COMPLETED: 'Completed',
}

export const marketsWithVideos = {
    [sellerMarketplaces.AMAZON]: true,
    [sellerMarketplaces.WALMART]: false,
    [sellerMarketplaces.EBAY]: true
}
