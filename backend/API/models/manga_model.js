import mongoose from 'mongoose';


const { Schema } = mongoose;


const MangaSchema = new Schema({
    manga_id: {
        type: String,
        required: false,
        default: ""
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    manga_status: {
        type: String,
        required: true
    },
    manga_state: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    year_published: {
        type: Number,
        required: false,
        default: null
    },
    cover_art: {
        type: String,
        required: false,
        default: ""
    }
}, { timestamps: true });


const MangaModel = mongoose.model('mangas', MangaSchema);



export default MangaModel;