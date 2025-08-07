import { uploadData, list } from 'aws-amplify/storage';

const UploadSketchesOnS3 = async (imageBLOB, path) =>{

    //console.log('nella api');
    try {
    const result = await uploadData({
        //path: `public/${userEmail}/style_${styleName}/sketches/${sketchName}.png`, 
        //path: 'public/prova.png',
        path: path,
        data: imageBLOB,
        options: {}
    }).result;
    //console.log('Succeeded: ', result);
    } catch (error) {
    console.log('Error : ', error);
    return false;
    }

    return true;
}

const listObjectOnS3 = async (path) =>{
    try {
        const result = await list({
        path: path,
        options: {
            listAll: true  //per ottenere la lista di tutto
        }
    });
    console.log(result.items)
    return result.items;
    } catch (error) {
    console.log(error);
    return error;
    }
    

}

export {UploadSketchesOnS3, listObjectOnS3}