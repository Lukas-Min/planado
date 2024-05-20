//* THIS FILE CONTAINS THE APIs (custom and 3rd party)
import { checkMandatoryField, checkStringField, containsCharacter } from '../../utils.js';
import MangaModel from '../models/manga_model.js';
import mongoose from 'mongoose';

const searchMangaById = async (req, res, next) => { //* This is a custom API that connects to MangaDex API

    let { mangaId } = req.params;

    try
    {

        if (!checkMandatoryField(mangaId)) 
        {
            return res.status(400).send({
                successful: false,
                message: "Manga id is not defined."
            })
        }

        if (!checkStringField(mangaId))
        {

            return res.status(400).send({
                successful: false,
                message: "Manga id is not a string."
            })

        }

        const mangaUrl = `https://api.mangadex.org/manga/${mangaId}`;
        const response = await fetch(mangaUrl);

        if (!response.ok)
        {
            return res.status(response.status).send({
                successful: false,
                message: "Failed to fetch manga data. Id does not exist"
            })
        }

        const mangaData = await response.json();

        const genreTags = mangaData.data.attributes.tags
        .filter(tag => tag.attributes.group === "genre")
        .map(tag => tag.attributes.name.en);

        const authorUrl = `https://api.mangadex.org/author/${mangaData.data.relationships[0].id}`;
        const authorResponse = await fetch(authorUrl);
        const authorData = await authorResponse.json();

        const coverArtUrl = `https://api.mangadex.org/cover/${mangaData.data.relationships[2].id}`
        const coverArtResponse = await fetch(coverArtUrl);
        const coverArtData = await coverArtResponse.json();

        return res.status(200).send({
            successful: true,
            message: "Manga data fetched successfully.",
            manga_id: mangaData.data.id,
            title: mangaData.data.attributes.title.en,
            description: mangaData.data.attributes.description.en,
            genre: genreTags,
            manga_status: mangaData.data.attributes.status,
            manga_state: mangaData.data.attributes.state,
            author: authorData.data.attributes.name,
            year_published: mangaData.data.attributes.year != null ? mangaData.data.attributes.year : "",
            cover_art: coverArtData.data.attributes.fileName
        })

    }
    catch (err)
    {
        return res.status(500).send({
            successful: false,
            message: 'Error fetching manga data',
            data: err.message
        })
    }

};


const deleteMangabyId = async (req, res, next) => { //* This API deletes manga data according to its oId (_id)

    let { id } = req.params;

    try
    {

        if (!checkMandatoryField(id)) 
        {
            return res.status(400).send({
                successful: false,
                message: "Object id is not defined."
            })
        }

        if (!containsCharacter(id, '-'))
        {
            return res.status(400).send({
                successful: false,
                message: "Manga id is not allowed."
            })
        }

        if (!checkStringField(id))
        {

            return res.status(400).send({
                successful: false,
                message: "Object id is not a string."
            })

        }


        const deleteManga = await MangaModel.findByIdAndDelete(id);


        if(!deleteManga)
        {

            return res.status(400).send({
                successful: false,
                message: "Error deleting manga data. Manga data does not exist"
            })

        }

        return res.status(200).send({
            successful: true,
            message: "Manga data deleted successfully."
        })

    }
    catch (err)
    {
        return res.status(500).send({
            successful: false,
            message: 'Error deleting manga data',
            data: err.message
        })
    }

};

const findAllManga = async (req, res, next) => { //* This fetches all existing manga data in the database

    try 
    {
        const allManga = await MangaModel.find();

        if (allManga.length == 0) 
        {
            return res.status(404).send({
                successful: false,
                message: 'No manga data found'
            })
        }

        return res.status(200).send({
            successful: true,
            message: 'Successfully got all manga data',
            data: allManga
        })

    } 
    catch (error) 
    {
        return res.status(200).send({
            successful: true,
            message: 'Error finding all manga data',
            data: allManga
        })
    }

}


export default { 
    searchMangaById,
    deleteMangabyId,
    findAllManga
}