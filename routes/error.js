exports.getErrorPage = (req, res, next) => {
    res.status(404).render('error', {
        pageTitle: 'Giornalino a puntini'
    })
}

exports.getWPage = (req, res, next) => {
    res.render('wp', {pageTitle: 'Work in progress'})
}