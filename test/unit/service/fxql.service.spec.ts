import { Test, TestingModule } from '@nestjs/testing';
import { FXQLStatementDto } from '../../../src/modules/fxql/dto/fxql.dto';
import { GlobalResponseHandler } from '../../../src/modules/common/response-handler';
import { FxqlRepository } from '../../../src/modules/fxql/repository/fxql.repository';
import { FxqlService } from '../../../src/modules/fxql/service/fxql.service';
import { CustomValidationPipe } from '../../../src/modules/common/custom-validation.pipe';

describe('FxqlService', () => {
  let service: FxqlService;
  let fxqlRepository: FxqlRepository;
  let mockResponseHandler: GlobalResponseHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FxqlService,
        {
          provide: FxqlRepository,
          useValue: {
            findMany: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: GlobalResponseHandler,
          useValue: {
            handleServiceResponse: jest.fn(),
          },
        },
        CustomValidationPipe,
      ],
    }).compile();

    service = module.get<FxqlService>(FxqlService);
    fxqlRepository = module.get<FxqlRepository>(FxqlRepository);
    mockResponseHandler = module.get<GlobalResponseHandler>(
      GlobalResponseHandler,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processFxql', () => {
    it('should process FXQL statements correctly', async () => {
      const mockFxqlDto: FXQLStatementDto[] = [
        { currencyPair: 'USD-GBP', buy: 0.85, sell: 0.9, cap: 10000 },
      ];

      const mockExistingFxql = {
        EntryId: 1,
        CurrencyPair: 'USD-GBP',
        SourceCurrency: 'EUR',
        DestinationCurrency: 'JPY',
        SellPrice: 146.5,
        BuyPrice: 145.2,
        CapAmount: 50000,
        createdAt: new Date()
      };
      const mockUpdatedFxql = { ...mockExistingFxql, BuyPrice: 0.85, SellPrice: 0.9 };

      jest.spyOn(fxqlRepository, 'findMany').mockResolvedValue([]);
      jest.spyOn(fxqlRepository, 'findOne').mockResolvedValue(mockExistingFxql);
      jest.spyOn(fxqlRepository, 'update').mockResolvedValue(mockUpdatedFxql);
      jest.spyOn(mockResponseHandler, 'handleServiceResponse');

      await service.processFxql(mockFxqlDto);

      expect(fxqlRepository.findMany).toHaveBeenCalledWith(['USD-GBP']);
      expect(fxqlRepository.update).toHaveBeenCalledWith(1, mockFxqlDto[0]);
      expect(mockResponseHandler.handleServiceResponse).toHaveBeenCalledWith({
        message: 'Rates Parsed Successfully.',
        data: [mockUpdatedFxql],
      });
    });
  });
});
