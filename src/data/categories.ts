export const categories = [
    {
        id: 'gaming',
        name: 'Gaming',
        nameAr: 'الألعاب',
        description: 'Gaming consoles, controllers & accessories',
        descriptionAr: 'منصات الألعاب وأجهزة التحكم والملحقات',
        image: 'https://pimcdn.sharafdg.com/cdn-cgi/image/width=300,height=300,fit=pad/images/S000394523_1?1760533220',
        href: '/products?category=gaming'
    },
    {
        id: 'tablets',
        name: 'Tablets',
        nameAr: 'الأجهزة اللوحية',
        description: 'iPads, Android tablets & accessories',
        descriptionAr: 'أجهزة الآيباد والأجهزة اللوحية أندرويد والملحقات',
        image: 'https://pimcdn.sharafdg.com/cdn-cgi/image/width=300,height=300,fit=pad/images/MEDIAPADT5_black_1?1721046795',
        href: '/products?category=tablets'
    },
    {
        id: 'smartphones',
        name: 'Phones',
        nameAr: 'الهواتف',
        description: 'Latest smartphone models & accessories',
        descriptionAr: 'أحدث موديلات الهواتف الذكية والملحقات',
        image: 'https://pimcdn.sharafdg.com/cdn-cgi/image/width=300,height=300,fit=pad/images/iphone_16_pro_max_desert_titanium_1?1726127643',
        href: '/products?category=smartphones'
    },
    {
        id: 'powerbanks',
        name: 'Power Banks',
        nameAr: 'بنوك الطاقة',
        description: 'Portable chargers & power solutions',
        descriptionAr: 'شواحن محمولة وحلول الطاقة',
        image: 'https://pimcdn.sharafdg.com/cdn-cgi/image/width=300,height=300,fit=pad/images/S500923209_1?1746168798',
        href: '/products?category=powerbanks'
    },
    {
        id: 'cables',
        name: 'Cables',
        nameAr: 'الكابلات',
        description: 'Charging cables & adapters',
        descriptionAr: 'كابلات الشحن والمحولات',
        image: 'https://pimcdn.sharafdg.com/cdn-cgi/image/width=300,height=300,fit=pad/images/S500929739_1?1747899915',
        href: '/products?category=cables'
    },
    {
        id: 'adapters',
        name: 'Adapters',
        nameAr: 'المحولات',
        description: 'Power adapters & converters',
        descriptionAr: 'محولات الطاقة والمحولات',
        image: 'https://pimcdn.sharafdg.com/cdn-cgi/image/width=300,height=300,fit=pad/images/S500943258_1?1761568730',
        href: '/products?category=adapters'
    }
];

export type Category = {
    id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    image: string;
    href: string;
};
