interface IMailConfig {
    driver: 'ethereal' | 'ses';
    defaults: {
        from: {
            email: string;
            name: string;
        };
    };
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',
    defaults: {
        from: {
            email: 'nhss.natham1@gmail.com',
            name: 'Nathanael Saraiva',
        },
    },
} as IMailConfig;
