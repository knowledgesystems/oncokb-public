import React, { useState } from 'react';
import './styles.scss';

const ReadMoreCell = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => setIsExpanded(!isExpanded);

  const renderText = () => {
    if (isExpanded) {
      return (
        <div className="left-align-content">
          {text}
          <span className="read-more-toggle" onClick={toggleReadMore}>
            Read less
          </span>
        </div>
      );
    }
    const limitedText =
      text.length > 100 ? text.substring(0, 100) + '...' : text;
    return (
      <>
        {limitedText}
        {text.length > 100 && (
          <span className="read-more-toggle" onClick={toggleReadMore}>
            Read more
          </span>
        )}
      </>
    );
  };

  return <div className="left-align-content">{renderText()}</div>;
};

export default ReadMoreCell;
