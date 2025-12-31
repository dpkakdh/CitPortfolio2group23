using AutoMapper;
using Portfolio2group23.DataServiceLayer.Models;
using Portfolio2group23.DTOs;

namespace Portfolio2group23.DataServiceLayer.Data
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Movie mapping
            CreateMap<Title, MovieDto>();
            CreateMap<MovieDto, Title>();

            // Bookmark mappings
            CreateMap<BookmarkTitle, BookmarkDto>();
            CreateMap<BookmarkDto, BookmarkTitle>();
            CreateMap<BookmarkName, BookmarkDto>();
            CreateMap<BookmarkDto, BookmarkName>();

            // Rating mapping
            CreateMap<Rating, RatingDto>();
            CreateMap<RatingDto, Rating>();

            // Search mapping
            CreateMap<SearchHistory, SearchDto>();
            CreateMap<SearchDto, SearchHistory>();
        }
    }
}
