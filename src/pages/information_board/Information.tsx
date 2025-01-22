import React, { useState } from 'react'
import MainNews from './MainNews';
import NewsList from './NewsList';
import "./Information.scss";
interface NewsItem {
    thumbnail: string;
    imageSrc: string;
    title: string;
  }
const Information = () => {
    const newsItems: NewsItem[] = [
        { thumbnail: "https://pbgdpl.baria-vungtau.gov.vn/portal/editor/images/H%C3%ACnh%20%E1%BA%A3nh%20v%E1%BB%81%20PCCC/1.jpg", imageSrc: "https://pbgdpl.baria-vungtau.gov.vn/portal/editor/images/H%C3%ACnh%20%E1%BA%A3nh%20v%E1%BB%81%20PCCC/1.jpg", title: "Mẹo chữa cháy nhà" },
        { thumbnail: "https://lh3.googleusercontent.com/proxy/XSj_ukNuTcHeUN7aHyrqFsgmmZSRiyyl4zfocgVpwvs0bYbDh40m2V7YJpjEuHnV7SJe07_jGQLARbhgJdFUjpXca1LDQQ_CJeIypMaL87vpIHI1LRcZkGRcoYdCZ3E-hN3mxqI-SUJ7UDcT9OQY5cIXyUC4AVTqsyLdzFzUub9M02Pmvut-suhsWCc", imageSrc: "https://lh3.googleusercontent.com/proxy/XSj_ukNuTcHeUN7aHyrqFsgmmZSRiyyl4zfocgVpwvs0bYbDh40m2V7YJpjEuHnV7SJe07_jGQLARbhgJdFUjpXca1LDQQ_CJeIypMaL87vpIHI1LRcZkGRcoYdCZ3E-hN3mxqI-SUJ7UDcT9OQY5cIXyUC4AVTqsyLdzFzUub9M02Pmvut-suhsWCc", title: "Quy trình hút thuốc thường quy" },
        { thumbnail: "https://vuadep.vn/wp-content/uploads/2023/08/Bang-tin-lop-200x100-m8.jpg", imageSrc: "https://vuadep.vn/wp-content/uploads/2023/08/Bang-tin-lop-200x100-m8.jpg", title: "Nóng ! Học sinh Lai Châu đi phượt khi mới 3 tuổi" },
        { thumbnail: "https://pbgdpl.baria-vungtau.gov.vn/portal/editor/images/H%C3%ACnh%20%E1%BA%A3nh%20v%E1%BB%81%20PCCC/1.jpg", imageSrc: "https://pbgdpl.baria-vungtau.gov.vn/portal/editor/images/H%C3%ACnh%20%E1%BA%A3nh%20v%E1%BB%81%20PCCC/1.jpg", title: "Mẹo chữa cháy nhà" },
        { thumbnail: "https://lh3.googleusercontent.com/proxy/XSj_ukNuTcHeUN7aHyrqFsgmmZSRiyyl4zfocgVpwvs0bYbDh40m2V7YJpjEuHnV7SJe07_jGQLARbhgJdFUjpXca1LDQQ_CJeIypMaL87vpIHI1LRcZkGRcoYdCZ3E-hN3mxqI-SUJ7UDcT9OQY5cIXyUC4AVTqsyLdzFzUub9M02Pmvut-suhsWCc", imageSrc: "https://lh3.googleusercontent.com/proxy/XSj_ukNuTcHeUN7aHyrqFsgmmZSRiyyl4zfocgVpwvs0bYbDh40m2V7YJpjEuHnV7SJe07_jGQLARbhgJdFUjpXca1LDQQ_CJeIypMaL87vpIHI1LRcZkGRcoYdCZ3E-hN3mxqI-SUJ7UDcT9OQY5cIXyUC4AVTqsyLdzFzUub9M02Pmvut-suhsWCc", title: "Quy trình hút thuốc thường quy" },
        { thumbnail: "https://vuadep.vn/wp-content/uploads/2023/08/Bang-tin-lop-200x100-m8.jpg", imageSrc: "https://vuadep.vn/wp-content/uploads/2023/08/Bang-tin-lop-200x100-m8.jpg", title: "Nóng ! Học sinh Lai Châu đi phượt khi mới 3 tuổi" },
        { thumbnail: "https://pbgdpl.baria-vungtau.gov.vn/portal/editor/images/H%C3%ACnh%20%E1%BA%A3nh%20v%E1%BB%81%20PCCC/1.jpg", imageSrc: "https://pbgdpl.baria-vungtau.gov.vn/portal/editor/images/H%C3%ACnh%20%E1%BA%A3nh%20v%E1%BB%81%20PCCC/1.jpg", title: "Mẹo chữa cháy nhà" },
        { thumbnail: "https://lh3.googleusercontent.com/proxy/XSj_ukNuTcHeUN7aHyrqFsgmmZSRiyyl4zfocgVpwvs0bYbDh40m2V7YJpjEuHnV7SJe07_jGQLARbhgJdFUjpXca1LDQQ_CJeIypMaL87vpIHI1LRcZkGRcoYdCZ3E-hN3mxqI-SUJ7UDcT9OQY5cIXyUC4AVTqsyLdzFzUub9M02Pmvut-suhsWCc", imageSrc: "https://lh3.googleusercontent.com/proxy/XSj_ukNuTcHeUN7aHyrqFsgmmZSRiyyl4zfocgVpwvs0bYbDh40m2V7YJpjEuHnV7SJe07_jGQLARbhgJdFUjpXca1LDQQ_CJeIypMaL87vpIHI1LRcZkGRcoYdCZ3E-hN3mxqI-SUJ7UDcT9OQY5cIXyUC4AVTqsyLdzFzUub9M02Pmvut-suhsWCc", title: "Quy trình hút thuốc thường quy" },
        { thumbnail: "https://vuadep.vn/wp-content/uploads/2023/08/Bang-tin-lop-200x100-m8.jpg", imageSrc: "https://vuadep.vn/wp-content/uploads/2023/08/Bang-tin-lop-200x100-m8.jpg", title: "Nóng ! Học sinh Lai Châu đi phượt khi mới 3 tuổi" },
        { thumbnail: "https://pbgdpl.baria-vungtau.gov.vn/portal/editor/images/H%C3%ACnh%20%E1%BA%A3nh%20v%E1%BB%81%20PCCC/1.jpg", imageSrc: "https://pbgdpl.baria-vungtau.gov.vn/portal/editor/images/H%C3%ACnh%20%E1%BA%A3nh%20v%E1%BB%81%20PCCC/1.jpg", title: "Mẹo chữa cháy nhà" },
        { thumbnail: "https://lh3.googleusercontent.com/proxy/XSj_ukNuTcHeUN7aHyrqFsgmmZSRiyyl4zfocgVpwvs0bYbDh40m2V7YJpjEuHnV7SJe07_jGQLARbhgJdFUjpXca1LDQQ_CJeIypMaL87vpIHI1LRcZkGRcoYdCZ3E-hN3mxqI-SUJ7UDcT9OQY5cIXyUC4AVTqsyLdzFzUub9M02Pmvut-suhsWCc", imageSrc: "https://lh3.googleusercontent.com/proxy/XSj_ukNuTcHeUN7aHyrqFsgmmZSRiyyl4zfocgVpwvs0bYbDh40m2V7YJpjEuHnV7SJe07_jGQLARbhgJdFUjpXca1LDQQ_CJeIypMaL87vpIHI1LRcZkGRcoYdCZ3E-hN3mxqI-SUJ7UDcT9OQY5cIXyUC4AVTqsyLdzFzUub9M02Pmvut-suhsWCc", title: "Quy trình hút thuốc thường quy" },
        { thumbnail: "https://vuadep.vn/wp-content/uploads/2023/08/Bang-tin-lop-200x100-m8.jpg", imageSrc: "https://vuadep.vn/wp-content/uploads/2023/08/Bang-tin-lop-200x100-m8.jpg", title: "Nóng ! Học sinh Lai Châu đi phượt khi mới 3 tuổi" },
        { thumbnail: "https://pbgdpl.baria-vungtau.gov.vn/portal/editor/images/H%C3%ACnh%20%E1%BA%A3nh%20v%E1%BB%81%20PCCC/1.jpg", imageSrc: "https://pbgdpl.baria-vungtau.gov.vn/portal/editor/images/H%C3%ACnh%20%E1%BA%A3nh%20v%E1%BB%81%20PCCC/1.jpg", title: "Mẹo chữa cháy nhà" },
        { thumbnail: "https://lh3.googleusercontent.com/proxy/XSj_ukNuTcHeUN7aHyrqFsgmmZSRiyyl4zfocgVpwvs0bYbDh40m2V7YJpjEuHnV7SJe07_jGQLARbhgJdFUjpXca1LDQQ_CJeIypMaL87vpIHI1LRcZkGRcoYdCZ3E-hN3mxqI-SUJ7UDcT9OQY5cIXyUC4AVTqsyLdzFzUub9M02Pmvut-suhsWCc", imageSrc: "https://lh3.googleusercontent.com/proxy/XSj_ukNuTcHeUN7aHyrqFsgmmZSRiyyl4zfocgVpwvs0bYbDh40m2V7YJpjEuHnV7SJe07_jGQLARbhgJdFUjpXca1LDQQ_CJeIypMaL87vpIHI1LRcZkGRcoYdCZ3E-hN3mxqI-SUJ7UDcT9OQY5cIXyUC4AVTqsyLdzFzUub9M02Pmvut-suhsWCc", title: "Quy trình hút thuốc thường quy" },
        { thumbnail: "https://vuadep.vn/wp-content/uploads/2023/08/Bang-tin-lop-200x100-m8.jpg", imageSrc: "https://vuadep.vn/wp-content/uploads/2023/08/Bang-tin-lop-200x100-m8.jpg", title: "Nóng ! Học sinh Lai Châu đi phượt khi mới 3 tuổi" },
        { thumbnail: "https://pbgdpl.baria-vungtau.gov.vn/portal/editor/images/H%C3%ACnh%20%E1%BA%A3nh%20v%E1%BB%81%20PCCC/1.jpg", imageSrc: "https://pbgdpl.baria-vungtau.gov.vn/portal/editor/images/H%C3%ACnh%20%E1%BA%A3nh%20v%E1%BB%81%20PCCC/1.jpg", title: "Mẹo chữa cháy nhà" },
        { thumbnail: "https://lh3.googleusercontent.com/proxy/XSj_ukNuTcHeUN7aHyrqFsgmmZSRiyyl4zfocgVpwvs0bYbDh40m2V7YJpjEuHnV7SJe07_jGQLARbhgJdFUjpXca1LDQQ_CJeIypMaL87vpIHI1LRcZkGRcoYdCZ3E-hN3mxqI-SUJ7UDcT9OQY5cIXyUC4AVTqsyLdzFzUub9M02Pmvut-suhsWCc", imageSrc: "https://lh3.googleusercontent.com/proxy/XSj_ukNuTcHeUN7aHyrqFsgmmZSRiyyl4zfocgVpwvs0bYbDh40m2V7YJpjEuHnV7SJe07_jGQLARbhgJdFUjpXca1LDQQ_CJeIypMaL87vpIHI1LRcZkGRcoYdCZ3E-hN3mxqI-SUJ7UDcT9OQY5cIXyUC4AVTqsyLdzFzUub9M02Pmvut-suhsWCc", title: "Quy trình hút thuốc thường quy" },
        { thumbnail: "https://vuadep.vn/wp-content/uploads/2023/08/Bang-tin-lop-200x100-m8.jpg", imageSrc: "https://vuadep.vn/wp-content/uploads/2023/08/Bang-tin-lop-200x100-m8.jpg", title: "Nóng ! Học sinh Lai Châu đi phượt khi mới 3 tuổi" },
        // Thêm tin khác...
      ];
    

      const [selectedNews, setSelectedNews] = useState<NewsItem>(newsItems[0]);

      const handleNewsClick = (newsItem: NewsItem) => {
        setSelectedNews(newsItem);
      };
    
      return (
        <div className="information">
            <div className="title">
            BẢNG TIN TRUYỀN THÔNG CMS VINA
            </div>
            <div className="content">
            <MainNews imageSrc={selectedNews.imageSrc} title={selectedNews.title} />
            <NewsList newsItems={newsItems} onNewsClick={handleNewsClick} />
            </div>         
        </div>
      );
}

export default Information