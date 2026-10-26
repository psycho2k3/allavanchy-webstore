const db = require("../config/database");


// The table holds a single row with id = 1. Create it on demand so a
// database that was set up without it still works.
const ensureRow = async () => {

    await db.query(
        `
        INSERT INTO site_settings (id)
        VALUES (1)
        ON CONFLICT (id) DO NOTHING
        `
    );

};


const SiteSettings = {


    async getSettings() {

        const result = await db.query(
            `
            SELECT *
            FROM site_settings
            WHERE id = 1
            `
        );

        if (result.rows[0]) {
            return result.rows[0];
        }

        await ensureRow();

        const created = await db.query(
            `
            SELECT *
            FROM site_settings
            WHERE id = 1
            `
        );

        return created.rows[0];

    },


    async updateSettings({
        site_mode,
        landing_button_label,
        hero_eyebrow,
        hero_heading,
        hero_subtext,
        hero_button_label
    }) {

        await ensureRow();

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
            WHERE id = 1
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

        await ensureRow();

        const result = await db.query(
            `
            UPDATE site_settings
            SET landing_image_url=$1, updated_at=NOW()
            WHERE id = 1
            RETURNING *
            `,
            [imageUrl]
        );

        return result.rows[0];

    },


    async updateHeroImage(imageUrl) {

        await ensureRow();

        const result = await db.query(
            `
            UPDATE site_settings
            SET hero_image_url=$1, updated_at=NOW()
            WHERE id = 1
            RETURNING *
            `,
            [imageUrl]
        );

        return result.rows[0];

    }


};


module.exports = SiteSettings;
