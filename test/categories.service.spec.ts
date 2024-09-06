import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../src/categories/categories.service';
import { NotFoundException } from '@nestjs/common';
import { CategoryEntity } from '../src/categories/entities/category.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Roles } from 'src/utility/common/user-roles.enum';
import { CreateCategoryDto } from '../src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../src/categories/dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
  });

  const mockedUser: UserEntity = {
    id: 1,
    name: "Joshua Oni",
    email: "davidjoshua603@gmail.com",
    password: "12345",
    roles: [Roles.ADMIN],
    createdAt: new Date(),
    updatedAt: new Date(),
    category: [],
    products: [],
    reviews: [],
    orders: [],
  };;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        title: "Footwear",
        description: "Category Description"
      };
      const savedCategory: CategoryEntity = {
        id: 2,
        title: "Footwear",
        description: "Category Description",
        createdAt: new Date(),
        updatedAt: new Date(),
        addedBy: mockedUser,
        products: []
      }

      jest.spyOn(categoryRepository, 'create').mockReturnValue(savedCategory);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(savedCategory);

      const result = await service.create(createCategoryDto, mockedUser);

      expect(result).toEqual(savedCategory);
      expect(categoryRepository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(categoryRepository.save).toHaveBeenCalledWith(savedCategory);
    });
  })

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories: CategoryEntity[] = [
        {
          id: 1,
          title: 'Test Category 1',
          description: "Test description 1",
          createdAt: new Date(),
          updatedAt: new Date(),
          addedBy: mockedUser,
          products: []
        },
        {
          id: 2,
          title: 'Test Category 2',
          description: "Test description 2",
          createdAt: new Date(),
          updatedAt: new Date(),
          addedBy: mockedUser,
          products: []
        }
      ];
      jest.spyOn(categoryRepository, 'find').mockResolvedValue(categories);

      const result = await service.findAll();

      expect(result).toEqual(categories);
      expect(categoryRepository.find).toHaveBeenCalled();
    });
  })

  describe('findOne', () => {
    it('should return a category by ID', async () => {
      const category: CategoryEntity = {
        id: 1,
        title: 'Test Category 1',
        description: "Test description 1",
        createdAt: new Date(),
        updatedAt: new Date(),
        addedBy: mockedUser,
        products: []
      }
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(category);

      const result = await service.findOne(1);

      expect(result).toEqual(category);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1
        },
        relations: {
          addedBy: true
        },
        select: {
          addedBy: {
            id: true,
            name: true,
            email: true
          }
        }
      });
    });

    it('should throw NotFoundException if category does not exist', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  })

  describe('update', () => {
    it('should update a category', async () => {
      const existingCategory: CategoryEntity = {
        id: 1,
        title: 'Test Category 1',
        description: "Test description 1",
        createdAt: new Date(),
        updatedAt: new Date(),
        addedBy: mockedUser,
        products: []
      };
      const updateCategoryDto: UpdateCategoryDto = {
        title: "Shoes",
        description: "Category Description"
      };
      const updatedCategory: CategoryEntity = { ...existingCategory, ...updateCategoryDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingCategory);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(updatedCategory);

      const result = await service.update(1, updateCategoryDto);

      expect(result).toEqual(updatedCategory);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(categoryRepository.save).toHaveBeenCalledWith(updatedCategory);
    });
  })
});
