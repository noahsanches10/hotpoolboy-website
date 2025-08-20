'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';


interface BlogManagerProps {
  posts: any[];
  onPostsChange: (posts: any[]) => void;
  isLoading: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function BlogManager({ posts, onPostsChange, isLoading }: BlogManagerProps) {
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    author: '',
    image: '',
    tags: '',
    content: '',
    date: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      author: '',
      image: '',
      tags: '',
      content: '',
      date: ''
    });
    setEditingPost(null);
    setIsCreating(false);
  };

  const handleEdit = (post: any) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      image: post.image || '',
      tags: post.tags ? post.tags.join(', ') : '',
      content: post.content || '',
      date: post.date || new Date().toISOString().split('T')[0]
    });
    setEditingPost(post);
    setIsCreating(false);
  };

  const handleCreate = () => {
    resetForm();
    setFormData(prev => ({
      ...prev,
      date: new Date().toISOString().split('T')[0]
    }));
    setIsCreating(true);
  };

  const handleSave = async () => {
    try {
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const postData = {
        ...formData,
        slug,
        date: formData.date,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      // Create markdown content
      const markdownContent = `---
title: "${postData.title}"
date: "${postData.date}"
excerpt: "${postData.excerpt}"
author: "${postData.author}"
image: "${postData.image}"
tags: [${postData.tags.map((tag: string) => `"${tag}"`).join(', ')}]
---

${postData.content}`;

      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          content: markdownContent,
          isEdit: !!editingPost
        })
      });

      if (response.ok) {
        alert(editingPost ? 'Post updated successfully!' : 'Post created successfully!');
        resetForm();
        // Refresh the posts list
        const postsResponse = await fetch('/api/admin/blog');
        if (postsResponse.ok) {
          const updatedPosts = await postsResponse.json();
          onPostsChange(updatedPosts);
        }
      } else {
        throw new Error('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/admin/blog?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Post deleted successfully!');
        onPostsChange(posts.filter(post => post.slug !== slug));
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  if (isCreating || editingPost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {isCreating ? 'Create New Post' : 'Edit Post'}
          </h3>
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Post Details</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter post title"
                />
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label htmlFor="date">Publish Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                placeholder="Brief description of the post"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="image">Featured Image URL</Label>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {/* Current Image Preview */}
                  {formData.image && (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={formData.image} 
                        alt="Featured image preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('type', 'blog');

                            const response = await fetch('/api/admin/upload', {
                              method: 'POST',
                              body: formData,
                            });

                            if (response.ok) {
                              const result = await response.json();
                              setFormData(prev => ({ ...prev, image: result.path }));
                            } else {
                              alert('Failed to upload image');
                            }
                          } catch (error) {
                            console.error('Error uploading image:', error);
                            alert('Failed to upload image');
                          }
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload featured image for blog post
                    </p>
                  </div>
                </div>
                
                {/* Manual URL Input */}
                <div>
                  <Label htmlFor="imageUrl">Or Enter Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://images.pexels.com/..."
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="maintenance, tips, plumbing"
              />
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div>
              <Label htmlFor="content">Post Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Write your blog post content..."
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-2">
                You can use Markdown formatting. For example: **bold**, *italic*, # Heading, - List item, [Link](url)
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex space-x-4">
          <Button onClick={handleSave} disabled={!formData.title || !formData.content}>
            {editingPost ? 'Update Post' : 'Create Post'}
          </Button>
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Blog Posts</h3>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </CardContent>
        </Card>
      ) : (
        posts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No blog posts yet</h4>
            <p className="text-gray-600 mb-4">Create your first blog post to get started</p>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.slug}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {post.title}
                      </h4>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.slug)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )
      )}
    </div>
  );
}