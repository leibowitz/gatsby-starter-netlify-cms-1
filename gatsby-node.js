const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

const query = `
query ContentByTemplateKey($filter: MarkdownRemarkFilterInput!)
{
  allMarkdownRemark(filter: $filter) {
    edges {
      node {
        id
        fields {
          slug
        }
        frontmatter {
          templateKey
        }
      }
    }
  }
}
`;

const createFunc = (template, createPage) => result => {
  if (result.errors) {
    /* eslint-disable no-console */
    result.errors.forEach(e => console.error(e.toString()));
    return Promise.reject(result.errors);
  }

  const pages = result.data.allMarkdownRemark.edges;

  pages.forEach((edge, index) => {
    const id = edge.node.id;
    createPage({
      path: edge.node.fields.slug,
      component: path.resolve(template),
      // additional data can be passed via context
      context: {
        id,
        slug: edge.node.fields.slug,
      }
    });
  });
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  return graphql(query, { filter: { frontmatter: { templateKey: { eq: 'my-template-type' } } } }).then(
    createFunc(`src/templates/page.js`, createPage)
  );
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
