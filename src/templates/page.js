import React from 'react'
import { graphql } from 'gatsby';

const Page = ({ data, location }) => {
  const { frontmatter, html, fields } = data.markdownRemark;
  return (<div>Hi</div>);
};

export default Page;

export const pageQuery = graphql`
  query IndexPageTemplate($id: String!) {
    markdownRemark(
      frontmatter: { templateKey: { eq: "my-template-type" } }
      id: { eq: $id }
    ) {
      frontmatter {
        document {
          name
          publicURL
        }
      }
    }
  }
`;
