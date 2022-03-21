import { randomBytes } from 'crypto'
import {diskStorage, Options} from 'multer'
import { resolve } from 'path'

export const multerConfig = {
    dest : resolve(__dirname, '..', '..', 'uploads'),
    storage: diskStorage({
        destination: (request, file, callback) => {
            callback(null, resolve(__dirname, '..', '..', 'uploads'));
        },
        filename: (request, file, callback) => {
            const req = request.body;
            let name_file:string;
            const date = new Date();
            const jenis = req.jenis;
            var CurrntMonth: string[] = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
            switch (jenis) {
                case "Arsip":
                    name_file = `INL-AR${date.getFullYear()}_${CurrntMonth[date.getMonth()]}${date.getDate()}${date.getMinutes()}${date.getSeconds()}-${date.getMilliseconds()}`;
                    break;
                case "Check Sheet":
                    name_file = `INL-CS${date.getFullYear()}_${CurrntMonth[date.getMonth()]}${date.getDate()}${date.getMinutes()}${date.getSeconds()}-${date.getMilliseconds()}`;
                    break;
                case "Commissioning":
                    name_file = `INL-CM${date.getFullYear()}_${CurrntMonth[date.getMonth()]}${date.getDate()}${date.getMinutes()}${date.getSeconds()}-${date.getMilliseconds()}`;
                    break;
                case "Form":
                    name_file = `INL-FR${date.getFullYear()}_${CurrntMonth[date.getMonth()]}${date.getDate()}${date.getMinutes()}${date.getSeconds()}-${date.getMilliseconds()}`;
                    break;
                case "Format SK":
                    name_file = `INL-FS${date.getFullYear()}_${CurrntMonth[date.getMonth()]}${date.getDate()}${date.getMinutes()}${date.getSeconds()}-${date.getMilliseconds()}`;
                    break;
                case "Instruksi Kerja":
                    name_file = `INL-IK${date.getFullYear()}_${CurrntMonth[date.getMonth()]}${date.getDate()}${date.getMinutes()}${date.getSeconds()}-${date.getMilliseconds()}`;
                    break;
                default:
                    name_file = `INL-SU${date.getFullYear()}_${CurrntMonth[date.getMonth()]}${date.getDate()}${date.getMinutes()}${date.getSeconds()}-${date.getMilliseconds()}`;
                    break;
            }
            const type = req.type;
            let filename:string;
            if (type == 'w') {
                filename = `${name_file}.docx`
            } else {
                filename = `${name_file}.pdf`
            }
            callback(null,filename);
            // randomBytes(16, (error, hash) => {
            //     if (error) {
            //         callback(error, file.filename);
            //     }
            //     const filename = `${hash.toString('hex')}.jpg`
            //     callback(null, filename);
            // })
        }
    }),
    limits:{
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (request, file, callback) => {
        const formats = [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/pdf'
        ];

        if (formats.includes(file.mimetype)){
            callback(null, true)
        } else {
            callback(new Error('Format not accepted'))
        }
    }
} as Options