import postModel from "../Models/PostModel.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getUserPosts = async(req,res)=>{
  const userId = req.params.id;
  try {
    const posts = await postModel.find({userId:userId}).sort({createdAt:-1});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}
export const createPost = async(req,res)=>{
const{userId,userName,image,description} = req.body;
try {
  const post = new postModel({
    userId,
    userName,
    image,
    likes:[],
    comments:[],
    description
  })
  await post.save();
  res.status(200).json(post);
} catch (error) {
  res.status(500).json({message:error.message})
}
}

//delete
export const deletePost = async(req,res)=>{
  const id = req.params.id;

try {
  const post = await postModel.findById(id);
    await post.deleteOne();
    res.status(200).json({message:'post deleted'})
} catch (error) {
  res.status(500).json({message:error.message})
}

}
//getposts
export const getPost = async(req,res)=>{
  const id = req.params.id;
  try {
    const post = await postModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

//updateposts
export const updatePost = async(req,res)=>{
const postId = req.params.id;
const {userId} = req.body;
try {
  const post = await postModel.findById(postId);
  if(post.userId === userId){
await post.updateOne({$set:req.body});
res.status(200).json({post});
  }else{
    res.status(403).json({message:`You can not update other person's post`})
  }
} catch (error) {
  res.status(500).json({message:error.message})
}
}

export const getLikes = async(req,res)=>{
  const postId = req.params.id;
  try {
    const post = await postModel.findById(postId);
    res.status(200).json(post.likes);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

export const likePost = async (req, res) => {
  const postId = req.params.id;
  const { userId}  = req.body;
  try {
    const post = await postModel.findById(postId);
    let updatedPost;
    if (!post.likes.includes(userId)) {
      updatedPost = await postModel.findByIdAndUpdate(
        postId,
        { $push: { likes: userId } },
        { new: true }
      );
    }
    res.status(200).json(updatedPost.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const dislikePost = async (req, res) => {
  const postId = req.params.id;
  const { userId}  = req.body;

  try {
    const post = await postModel.findById(postId);
    let updatedPost;
    if (post.likes.includes(userId)) {
      updatedPost = await postModel.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
    } 
    res.status(200).json(updatedPost.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


 export const getComments = async(req,res)=>{
  const postId = req.params.id;
  try {
    const post = await postModel.findById(postId);
    const sortedComments = post.comments;
    //.sort((a, b) => new Date(b.date) - new Date(a.date))

    res.status(200).json(sortedComments);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
 }

 export const makeComment = async(req,res)=>{
  const postId = req.params.id;
  const {userId,userName,comment,date,userProfilePicture} = req.body;
  try {
    const post = await postModel.findByIdAndUpdate(postId,{
      $push:{comments:{userId,userProfilePicture,userName,comment,date}}
    },{new:true});
    const sortedComments = post.comments.sort((a, b) => b.date - a.date);
    res.status(200).json(sortedComments);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
 }