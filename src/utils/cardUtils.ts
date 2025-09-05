import html2canvas from 'html2canvas';

export const downloadCardAsImage = async (cardElement: HTMLElement, filename: string) => {
  try {
    // Use html2canvas to capture the element
    const canvas = await html2canvas(cardElement, {
      backgroundColor: null,
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true
    });
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
    
  } catch (error) {
    console.error('Error downloading card:', error);
    alert('Download failed. Please try again.');
  }
};

export const shareCard = async (title: string, message: string, url?: string) => {
  const shareData = {
    title: title,
    text: message,
    url: url || window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${title}\n\n${message}\n\n${shareData.url}`);
      alert('Card content copied to clipboard!');
    }
  } catch (error) {
    console.error('Error sharing:', error);
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${title}\n\n${message}`);
      alert('Card content copied to clipboard!');
    } catch (clipboardError) {
      console.error('Clipboard error:', clipboardError);
    }
  }
};

export const shareToWhatsApp = (title: string, message: string) => {
  const text = encodeURIComponent(`${title}\n\n${message}`);
  const whatsappUrl = `https://wa.me/?text=${text}`;
  window.open(whatsappUrl, '_blank');
};

export const shareToTwitter = (title: string, message: string) => {
  const text = encodeURIComponent(`${title}\n\n${message}`);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(twitterUrl, '_blank');
};

export const shareToFacebook = (title: string, message: string) => {
  const text = encodeURIComponent(`${title}\n\n${message}`);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?quote=${text}`;
  window.open(facebookUrl, '_blank');
};