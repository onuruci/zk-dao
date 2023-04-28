import React, {useState, useEffect} from "react";
import avatar from "../img/ObtLogo.png";
import postButton from "../img/svg.svg"
import PostCard from "../components/PostCard";

import { observer } from 'mobx-react-lite'
import './forum.css'

export default observer(() => {

    
    const [postContext, setPostContext] = useState({title: "",description: ""});

    const handleChange = (event: any) => {
        const { name, value} = event.target
        setPostContext((prevPostContext) => ({ ...prevPostContext, [name]: value }));
    }

    const submitData = (event: any) => {
        event.preventDefault()
    }

    interface Post {
        id: number;
        title: string;
        description: string;
      }
      
      const [posts, setPosts] = useState<Array<Post>>([]);
      
      useEffect(() => {
        // Fetch your posts from your backend or blockchain here
        // For this example, I'm using a hardcoded list
        const fetchedPosts: Post[] = [
          { id: 0, title: "Post 1", description: "Description 1" },
          { id: 1, title: "Post 2", description: "Description 2" },
        ];
        setPosts(fetchedPosts);
      }, []);

    return(
        <div className="forum-wrapper">
            <div className="create-post">
                <form>
                    <input className="create-post-title" type="text" placeholder="Title..." id="title" name="title" value={postContext.title} onChange={handleChange} />
                    <br/>
                    <input className="create-post-context" type="text" placeholder="What do you think?" id="description" name="description" value={postContext.description} onChange={handleChange} />
                    <br/>
                    <div className="submit-button" onClick={submitData}>
                        <img className="submit-button-image" src={postButton} />
                    </div>
                </form>

            </div>
            {posts.map((post) => (
                <PostCard key={post.id} postId={post.id} title={post.title} description={post.description}/>
      ))}
        </div>
    )

}  )
