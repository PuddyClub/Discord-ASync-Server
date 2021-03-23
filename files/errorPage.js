module.exports = (req, res, data) => {

    // Is a Error Page
    if (res && req) {

        // Prepare Result
        const result = { code: data.code };

        // Get Error Message
        if (data.message) { result.text = data.message; }
        else if (data.err && data.err.message) { result.text = data.err.message; }
        else { result.text = '???'; }

        // Log
        if (data.code !== 404) {
            let errorData = null;
            if (data.err) { errorData = data.err; }
            else if (data.message) { errorData = new Error(data.message); }
            else { errorData = new Error('Unknown Error'); }
            errorData.code = data.code;
            console.error(errorData);
        }

        // Send Error Page
        return res.json(result);

    }

    // Nothing
    else { return; }

};