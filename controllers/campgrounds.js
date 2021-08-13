
const Campground = require('../models/camp');

module.exports.index = async (req, res) =>{
    const campgrounds = await Campground.find({}); //grabs campground collection (all)
    res.render('./campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res)=>{ //render 'new campground' page
    res.render('./campgrounds/new');
}

module.exports.createNewCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground); //.campground because result campground[] due to form from new
    //id is pulled from req.user (which is provided by passport when user is logged in). This is needed because campground[author]'s data references to the user schema by the id. (objectID)
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'successfully made a new campground!'); //flashing message after creating campground (if successful)
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.viewCampground = async (req, res) => {
    //populates new reviews every time route is reached
    //gathers all information from reviews and reviews[author]. Used to get info from user and review.
    //also gets information from campground author
    //nested populate...populates a nested array
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){  //incase you try to pass empty campground in render template
        req.flash('error', 'unable to find campground');
        return res.redirect('/campgrounds');
    }   
    res.render('./campgrounds/show', { campground });
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'unable to find campground');
        return res.redirect('/campgrounds');
    }
    res.render('./campgrounds/edit', { campground });
}

module.exports.updateEditForm = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'successfully updated campground')
    res.redirect(`/campgrounds/${campground.id}`)

}

module.exports.deleteCampground = async(req, res)=>{
    const id = req.params.id;
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'successfully deleted campground')
    res.redirect('/campgrounds')
}

