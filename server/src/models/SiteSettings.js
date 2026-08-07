const db = require("../config/database");


const SiteSettings = {


    async getSettings() {

        const result = await db.query(
            `
            SELECT *
            FROM site_settings
            LIMIT 1
            `
        );

        return result.rows[0];

    },


    async updateSettings({
        site_mode,
        landing_button_label,
        hero_eyebrow,
        hero_heading,
        hero_subtext,
        hero_button_label
    }) {

        const result = await db.query(
            `
            UPDATE site_settings
            SET
                site_mode=COALESCE($1, site_mode),
                landing_button_label=COALESCE($2, landing_button_label),
                hero_eyebrow=COALESCE($3, hero_eyebrow),
                hero_heading=COALESCE($4, hero_heading),
                hero_subtext=COALESCE($5, hero_subtext),
                hero_button_label=COALESCE($6, hero_button_label),
                updated_at=NOW()
            RETURNING *
            `,
            [
                site_mode,
                landing_button_label,
                hero_eyebrow,
                hero_heading,
                hero_subtext,
                hero_button_label
            ]
        );

        return result.rows[0];

    },


    async updateLandingImage(imageUrl) {

        const result = await db.query(
            `
            UPDATE site_settings
            SET landing_image_url=$1, updated_at=NOW()
            RETURNING *
            `,
            [imageUrl]
        );

        return result.rows[0];

    },


    async updateHeroImage(imageUrl) {

        const result = await db.query(
            `
            UPDATE site_settings
            SET hero_image_url=$1, updated_at=NOW()
            RETURNING *
            `,
            [imageUrl]
        );

        return result.rows[0];

    }


};


module.exports = SiteSettings;