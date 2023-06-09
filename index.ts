import { Client } from 'pg';
import { config } from "dotenv";

config({ path: `./.env` });

const main = async () => {
    const client = new Client({
        connectionString: process.env.DB_CONNECTION_STRING,
    });

    await client.connect(async (err) => {
        if (err)
            throw Error(err.stack);
    });

    const mostViewedVideos = await client.query(`
    SELECT videos.id AS video_id, videos.title AS video_title, videos.preview_url AS video_preview, videos.duration AS video_duration, videos.published_at AS video_publish_date, COUNT(likes.video_id) AS like_count
    FROM videos
    JOIN likes ON videos.id = likes.video_id
    WHERE likes.positive = true AND videos.published_at >= '2021-09-01'
    GROUP BY videos.id
    HAVING COUNT(likes.video_id) > 4
    ORDER BY like_count DESC
    LIMIT 10;`).rows;
    console.log(mostViewedVideos);

    /*
    const usersWithChannels = await client.query(`
    SELECT users.id AS user_id, users.name AS user_name, users.avatar_url AS user_avatar, channels.photo_url AS channel_photo, channels.description AS channel_description, channels.created_at AS channel_creation_date
    FROM users
    JOIN channels ON users.id = channels.user_id
    ORDER BY channels.created_at DESC;
    `).rows;
    console.log(usersWithChannels);

    const topLikedVideos = await client.query(`
    SELECT videos.id AS video_id, videos.title AS video_title, videos.preview_url AS video_preview, videos.duration AS video_duration, videos.published_at AS video_publish_date
    FROM videos
    JOIN likes ON videos.id = likes.video_id
    ORDER BY likes.positive DESC
    LIMIT 5;
    `).rows;
    console.log(topLikedVideos);

    const videosFromSubscription = await client.query(`
    SELECT videos.id AS video_id, videos.title AS video_title, videos.preview_url AS video_preview, videos.duration AS video_duration, videos.published_at AS video_publish_date
    FROM videos
    JOIN channels ON videos.channel_id = channels.id
    JOIN subscriptions ON channels.id = subscriptions.channel_id
    JOIN users ON subscriptions.user_id = users.id
    WHERE users.name = 'Stephanie Bulger'
    ORDER BY videos.published_at DESC;
    `).rows;
    console.log(videosFromSubscription);

    const channelVideos = await client.query('
    SELECT channels.*, COUNT(subscriptions.user_id) AS subscriber_count
    FROM channels
    LEFT JOIN subscriptions ON channels.id = subscriptions.channel_id
    WHERE channels.id = '79f6ce8f-ee0c-4ef5-9c36-da06b7f4cb76'
    GROUP BY channels.id;').rows;
    console.log(channelVideos);

    const subscriptionsForUser = await client.query(`
    SELECT videos.id AS video_id, videos.title AS video_title, videos.preview_url AS video_preview, videos.duration AS video_duration, videos.published_at AS video_publish_date, COUNT(likes.video_id) AS like_count
    FROM videos
    JOIN likes ON videos.id = likes.video_id
    WHERE likes.positive = true AND videos.published_at >= '2021-09-01'
    GROUP BY videos.id
    HAVING COUNT(likes.video_id) > 4
    ORDER BY like_count DESC
    LIMIT 10; `).rows;
    console.log(subscriptionsForUser);
    */
};

main();



